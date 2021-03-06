#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::sync::Arc;

use rand::Rng;
use tauri::{ command, Manager, generate_handler };

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            let mut hra: Option<Hra> = None;
            window.listen("create-map", |event| {
                match event.payload() {
                    Some(payload) => {
                        let rozliseni = payload.parse::<u32>().unwrap();
                        hra = Some(Hra::new(rozliseni));
                    }, 
                    None => {
                        println!("Error: No payload");
                    },
                }
                // println!("{:?}", &hra);
                // hra = Some(Hra::new(Arc::new(event.payload().unwrap())));
            });

            Ok(())
        })
        .invoke_handler(generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
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
