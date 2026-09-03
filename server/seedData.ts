export interface SeedPlace {
  title: string;
  originalName: string;
  category: 'buda' | 'pest' | 'termas' | 'ruin-bars' | 'cultura' | 'miradores';
  description: string;
  visited: boolean;
  priority: 'imprescindible' | 'recomendado' | 'opcional';
  estimatedTimeMinutes: number;
  locationName: string;
  googleMapsQuery: string;
  tip: string;
}

export const BUDAPEST_SEED_PLACES: SeedPlace[] = [
  {
    title: "Parlamento de Budapest",
    originalName: "Országház",
    category: "pest",
    description: "El edificio más icónico de Hungría a orillas del Danubio, de estilo neogótico con 691 habitaciones y la corona de San Esteban.",
    visited: false,
    priority: "imprescindible",
    estimatedTimeMinutes: 90,
    locationName: "Kossuth Lajos tér 1-3, Pest",
    googleMapsQuery: "Hungarian Parliament Building Budapest",
    tip: "Cruza al atardecer a la orilla de Buda (Batthyány tér) para ver la fachada completamente iluminada reflejada en el río."
  },
  {
    title: "Bastión de los Pescadores",
    originalName: "Halászbástya",
    category: "buda",
    description: "Mirador panorámico de estilo neorrománico con 7 torres que conmemoran las 7 tribus magiares que fundaron el país.",
    visited: false,
    priority: "imprescindible",
    estimatedTimeMinutes: 60,
    locationName: "Distrito del Castillo, Buda",
    googleMapsQuery: "Fisherman's Bastion Budapest",
    tip: "Ve temprano por la mañana (antes de las 9:00 AM) para disfrutar de las mejores vistas sin multitudes y con entrada libre a las terrazas."
  },
  {
    title: "Castillo de Buda y Palacio Real",
    originalName: "Budavári Palota",
    category: "buda",
    description: "Antigua residencia de los reyes húngaros en lo alto de la colina. Alberga la Galería Nacional y el Museo de Historia de Budapest.",
    visited: false,
    priority: "imprescindible",
    estimatedTimeMinutes: 120,
    locationName: "Szent György tér 2, Buda",
    googleMapsQuery: "Buda Castle Budapest",
    tip: "Puedes subir caminando por los senderos de los jardines o tomar el histórico funicular Sikló desde la plaza Clark Ádám."
  },
  {
    title: "Baños Termales Széchenyi",
    originalName: "Széchenyi Gyógyfürdő",
    category: "termas",
    description: "Uno de los mayores balnearios medicinales de Europa, famoso por sus piscinas termales exteriores de color amarillo neobarroco.",
    visited: false,
    priority: "imprescindible",
    estimatedTimeMinutes: 180,
    locationName: "Állatkerti krt. 9-11 (Parque de la Ciudad), Pest",
    googleMapsQuery: "Széchenyi Thermal Bath Budapest",
    tip: "Lleva tus propias chanclas, toalla y gorro de natación para evitar pagar suplementos de alquiler."
  },
  {
    title: "Puente de las Cadenas",
    originalName: "Széchenyi Lánchíd",
    category: "pest",
    description: "El puente colgante más antiguo que unió históricamente las ciudades gemelas de Buda y Pest en 1849, custodiado por leones de piedra.",
    visited: false,
    priority: "imprescindible",
    estimatedTimeMinutes: 30,
    locationName: "Sobre el río Danubio",
    googleMapsQuery: "Chain Bridge Budapest",
    tip: "Cruzarlo a pie durante la noche ofrece una vista mágica entre el Castillo iluminado y el Parlamento."
  },
  {
    title: "Basílica de San Esteban",
    originalName: "Szent István-bazilika",
    category: "pest",
    description: "La iglesia más grande de Budapest, con 96 metros de altura. Guarda la reliquia de la Santa Diestra (la mano momificada del rey Esteban I).",
    visited: false,
    priority: "imprescindible",
    estimatedTimeMinutes: 60,
    locationName: "Szent István tér 1, Pest",
    googleMapsQuery: "St. Stephen's Basilica Budapest",
    tip: "Sube a la cúpula panorámica para obtener una vista de 360 grados de todo el centro urbano."
  },
  {
    title: "Ruin Pub Szimpla Kert",
    originalName: "Szimpla Kert",
    category: "ruin-bars",
    description: "El pionero y más legendario 'bar en ruinas' del barrio judío, instalado en un edificio abandonado decorado con arte reciclado y un Trabant cortado.",
    visited: false,
    priority: "imprescindible",
    estimatedTimeMinutes: 90,
    locationName: "Kazinczy u. 14, Distrito VII (Barrio Judío)",
    googleMapsQuery: "Szimpla Kert Budapest",
    tip: "Los domingos por la mañana celebran un mercado de productores locales con quesos artesanos, miel y música en directo."
  },
  {
    title: "Zapatos en la orilla del Danubio",
    originalName: "Cipők a Duna-parton",
    category: "pest",
    description: "Conmovedor monumento en memoria de las víctimas judías fusiladas por la Cruz Flechada durante la Segunda Guerra Mundial arrojadas al río.",
    visited: false,
    priority: "imprescindible",
    estimatedTimeMinutes: 20,
    locationName: "Id. Antall József rkp., a unos metros del Parlamento",
    googleMapsQuery: "Shoes on the Danube Bank Budapest",
    tip: "Un lugar de respeto y recogimiento. Al atardecer la luz del Danubio es especialmente emotiva."
  },
  {
    title: "Gran Mercado Central",
    originalName: "Nagy Vásárcsarnok",
    category: "pest",
    description: "Espectacular mercado techado del siglo XIX con estructura de hierro y techo de cerámica Zsolnay. Puestos gastronómicos y de artesanía.",
    visited: false,
    priority: "recomendado",
    estimatedTimeMinutes: 75,
    locationName: "Vámház krt. 1-3, Pest",
    googleMapsQuery: "Great Market Hall Budapest",
    tip: "Prueba el tradicional 'Lángos' (pan frito húngaro con crema agria y queso) en el piso superior y compra pimentón auténtico (paprika)."
  },
  {
    title: "Colina Gellért y Ciudadela",
    originalName: "Gellért-hegy és Citadella",
    category: "miradores",
    description: "Colina de 235 metros coronada por la Estatua de la Libertad de Hungría, con las vistas panorámicas más amplias del Danubio y sus puentes.",
    visited: false,
    priority: "recomendado",
    estimatedTimeMinutes: 90,
    locationName: "Gellért-hegy, Buda",
    googleMapsQuery: "Gellért Hill Budapest",
    tip: "El sendero entre árboles que sube desde el Puente de la Libertad pasa por la Capilla en la Roca (Sziklatemplom)."
  },
  {
    title: "Gran Sinagoga de Budapest",
    originalName: "Dohány utcai zsinagóga",
    category: "cultura",
    description: "La sinagoga más grande de Europa y la segunda del mundo. De estilo morisco-bizantino con el Árbol de la Vida en su jardín conmemorativo.",
    visited: false,
    priority: "recomendado",
    estimatedTimeMinutes: 75,
    locationName: "Dohány u. 2, Distrito VII",
    googleMapsQuery: "Dohány Street Synagogue Budapest",
    tip: "Recuerda que los viernes por la tarde y los sábados está cerrada por el Shabat."
  },
  {
    title: "Baños Gellért",
    originalName: "Gellért Gyógyfürdő",
    category: "termas",
    description: "Famoso balneario Art Nouveau con mosaicos de cerámica, columnas de mármol y vidrieras ornamentadas en el histórico Hotel Gellért.",
    visited: false,
    priority: "recomendado",
    estimatedTimeMinutes: 150,
    locationName: "Kelenhegyi út 4, Buda",
    googleMapsQuery: "Gellért Thermal Bath Budapest",
    tip: "Menos masificado que Széchenyi y con una arquitectura interior de época verdaderamente elegante."
  },
  {
    title: "Isla Margarita",
    originalName: "Margit-sziget",
    category: "cultura",
    description: "Isla verde en medio del Danubio con ruinas medievales de conventos, fuente musical, jardines japoneses y pista para correr.",
    visited: false,
    priority: "opcional",
    estimatedTimeMinutes: 120,
    locationName: "En medio del Danubio entre Buda y Pest",
    googleMapsQuery: "Margaret Island Budapest",
    tip: "Puedes alquilar un 'bringóhintó' (coche de pedales familiar) para recorrer la isla tranquilamente."
  },
  {
    title: "Castillo Vajdahunyad",
    originalName: "Vajdahunyad vára",
    category: "cultura",
    description: "Castillo romántico de fantasía construido en 1896 en el Parque de la Ciudad que combina arquitectura románica, gótica, renacentista y barroca.",
    visited: false,
    priority: "opcional",
    estimatedTimeMinutes: 60,
    locationName: "Városliget (Parque de la Ciudad)",
    googleMapsQuery: "Vajdahunyad Castle Budapest",
    tip: "En invierno el lago adyacente se convierte en una de las pistas de patinaje sobre hielo al aire libre más grandes de Europa."
  }
];
