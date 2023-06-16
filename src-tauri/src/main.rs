// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rand::{self, Rng};
use std::sync::{Mutex, atomic::AtomicBool, Arc};

use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Clone, Debug, Serialize, Deserialize)]
struct Map {
    map: Vec<Vec<bool>>,
}

impl Map {
    
    fn new(res: usize) -> Self {
        let mut rng = rand::thread_rng();

        let mut map: Vec<Vec<bool>> = Vec::new();
        for _ in 0..res {
            let mut row: Vec<bool> = Vec::new();
            for _ in 0..res {
                row.push(rng.gen_ratio(1, 4));
            }
            map.push(row);
        }

        return Self {
            map
        };
    }



    fn neigh_count(&self, x: isize, y: isize) -> u8 {
        let res = self.map.len() as isize;
        let mut neigh_count = 0;

        let neighs = [
            (x - 1, y - 1),
            (x, y - 1),
            (x + 1, y - 1),
            (x - 1, y),
            (x + 1, y),
            (x - 1, y + 1),
            (x, y + 1),
            (x + 1, y + 1),
        ];

        for mut neigh in neighs {
            while neigh.0 < 0 {
                neigh.0 += res; 
            }
            while neigh.0 >= res {
                neigh.0 -= res;
            }
            while neigh.1 < 0 {
                neigh.1 += res;
            }
            while neigh.1 >= res {
                neigh.1 -= res;
            }

            if self.map[neigh.0 as usize][neigh.1 as usize] {
                neigh_count += 1;
            }
        }

        return neigh_count;
    }
}

#[tauri::command]
fn init(app: tauri::AppHandle) -> Map {
    let map = Map::new(32);
    let state = Mutex::new(map.clone());

    app.manage(state);

    return map;
}


#[tauri::command]
fn start(app: tauri::AppHandle) {
    let pending_stop = Arc::new(AtomicBool::new(false));

    let pending_stop_clone = pending_stop.clone();
    app.listen_global("stop", move |_event| {
        pending_stop_clone.swap(true, std::sync::atomic::Ordering::AcqRel);
    });

    std::thread::spawn(move || {
        let state = app.state::<Mutex<Map>>();
        let mut state = state.lock().unwrap();

        while !pending_stop.load(std::sync::atomic::Ordering::Acquire) {
            let resolution = state.map.len();
            let mut new_map = vec![vec![false;resolution];resolution];

            // fill the map with random values
            for x in 0..resolution {
                for y in 0..resolution {
                    let point_state = state.map[x][y];
                    let neigh_count = state.neigh_count(x as isize, y as isize);

                    new_map[x][y] = match point_state {
                        true => {
                            match neigh_count {
                                2 => true,
                                3 => true,
                                _ => false,
                            }
                        },
                        false => {
                            match neigh_count {
                                3 => true,
                                _ => false,
                            }
                        },
                    };
                }
            }

            let mut has_changed = false;
            for x in 0..resolution {
                for y in 0..resolution {
                    if state.map[x][y] != new_map[x][y] {
                        has_changed = true;
                    }
                }
            }

            if has_changed {
                state.map = new_map;
                app.emit_all("tick", state.map.clone()).unwrap();
                std::thread::sleep(std::time::Duration::from_millis(100));
            } else {
                app.emit_all("end", ()).unwrap();
                break;
            }
        }
    });
}

#[tauri::command]
fn reset(app: tauri::AppHandle) -> Map {
    let state = app.state::<Mutex<Map>>();
    let mut state = state.lock().unwrap();

    let new_map = Map::new(32);
    state.clone_from(&new_map);

    return new_map;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start, init, reset])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

