#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use rand::Rng;
use tauri::{command, generate_handler};

fn main() {
    tauri::Builder::default()
        .invoke_handler(generate_handler![vytvor_mapu])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[command]
fn vytvor_mapu(rozliseni: u32, window: tauri::Window) {
    let mut mapa = Hra::new(rozliseni);
    window.emit("update_table", &mapa.mapa).unwrap();

    for i in 0..100 {
        mapa.dalsi_generace();
        window.emit("update_table", &mapa.mapa);
    }
    println!("finito");
}

#[command]
fn start() {
    loop {}
}

#[derive(Debug)]
struct Hra {
    rozliseni: u32,
    mapa: Vec<bool>,
    mapa_dalsi: Vec<bool>,
}

impl Hra {
    fn new(rozliseni: u32) -> Hra {
        let mut rng = rand::thread_rng();
        Hra {
            rozliseni,
            mapa: (0..(rozliseni * rozliseni))
                .map(|_| match rng.gen_range(0..4) {
                    0 => true,
                    _ => false,
                })
                .collect(),
            mapa_dalsi: vec![false; (rozliseni * rozliseni) as usize],
        }
    }

    fn stav(&self, mut x: i32, mut y: i32) -> bool {
        let rozliseni = self.rozliseni as i32;

        while x < 0 {
            x += rozliseni
        }
        while x >= rozliseni {
            x -= rozliseni;
        }
        while y < 0 {
            y += rozliseni;
        }
        while y >= rozliseni {
            y -= rozliseni;
        }

        self.mapa[((y * rozliseni) + x) as usize]
    }

    fn pocet_sousedu(&self, x: i32, y: i32) -> u8 {
        let mut pocet_sousedu = 0;

        let sousedi = [
            (x - 1, y - 1),
            (x, y - 1),
            (x + 1, y - 1),
            (x - 1, y),
            (x + 1, y),
            (x - 1, y + 1),
            (x, y + 1),
            (x + 1, y + 1),
        ];

        for soused in sousedi {
            pocet_sousedu += match self.stav(soused.0, soused.1) {
                true => 1,
                false => 0,
            }
        }
        pocet_sousedu
    }

    fn dalsi_generace(&mut self) {
        for x in 0..self.rozliseni {
            for y in 0..self.rozliseni {
                let index_policka = ((y * self.rozliseni) + x) as usize;
                let pocet_sousedu = self.pocet_sousedu(x as i32, y as i32);
                let policko_dalsi_generaci = match self.mapa[index_policka] {
                    true => match pocet_sousedu {
                        2 => true,
                        3 => true,
                        _ => false,
                    },
                    false => match pocet_sousedu {
                        3 => true,
                        _ => false,
                    },
                };
                self.mapa_dalsi
                    .insert(index_policka, policko_dalsi_generaci);
            }
        }
    }
}
