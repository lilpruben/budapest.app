// Curated, verified high-resolution photography for all Budapest landmarks and spots
// With intelligent keyword matching and category defaults

export interface LandmarkPhotoInfo {
  url: string;
  credit?: string;
}

export const BUDAPEST_LANDMARK_PHOTOS: Record<string, string> = {
  // Top Iconic Monuments & Sites
  parlamento:
    'https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=1000&q=80',
  orszaghaz:
    'https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=1000&q=80',
  halaszbastya:
    'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1000&q=80',
  'bastion-de-los-pescadores':
    'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1000&q=80',
  'puente-de-las-cadenas':
    'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1000&q=80',
  lanchid:
    'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1000&q=80',
  'basilica-de-san-esteban':
    'https://images.unsplash.com/photo-1565426873118-a17ed65d74b9?auto=format&fit=crop&w=1000&q=80',
  'szent-istvan':
    'https://images.unsplash.com/photo-1565426873118-a17ed65d74b9?auto=format&fit=crop&w=1000&q=80',
  'gran-sinagoga':
    'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1000&q=80',
  dohany:
    'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1000&q=80',
  'castillo-de-buda':
    'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1000&q=80',
  'galeria-nacional':
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80',
  citadella:
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
  'colina-gellert':
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
  gellert:
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80',
  szechenyi:
    'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1000&q=80',
  'ruin-bars':
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80',
  szimpla:
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80',
  instant:
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
  fogas:
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
  'zapatos-en-la-orilla':
    'https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=1000&q=80',
  vajdahunyad:
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
  'plaza-de-los-heroes':
    'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1000&q=80',
  hosok:
    'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1000&q=80',
  opera:
    'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1000&q=80',
  opereta:
    'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=1000&q=80',
  terror:
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1000&q=80',
  karavan:
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1000&q=80',
  'mercado-central':
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1000&q=80',
  vasarcsarnok:
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1000&q=80',
  margarita:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
  japones:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
  aquincum:
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80',
  a38:
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
  smashy:
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
  magic:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
  moon:
    'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1000&q=80',
  nyugati:
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
  mcdonald:
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80',
  westend:
    'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=1000&q=80',
  mammut:
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80',
  aeropuerto:
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1000&q=80',
  dob:
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80',
  souvenir:
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
  exchange:
    'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=1000&q=80',
  libertad:
    'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1000&q=80',
  szabadsag:
    'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1000&q=80',
  principe:
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
  ordog:
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
  mariposas:
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1000&q=80',
  tropicarium:
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
  zoo:
    'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1000&q=80',
  mirage:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
  iguana:
    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1000&q=80',
  pop:
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
  newyork:
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
};

// Fallback high-resolution photos by category
export const CATEGORY_FALLBACK_PHOTOS: Record<string, string> = {
  buda: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1000&q=80',
  pest: 'https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=1000&q=80',
  termas:
    'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1000&q=80',
  'ruin-bars':
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80',
  cultura:
    'https://images.unsplash.com/photo-1565426873118-a17ed65d74b9?auto=format&fit=crop&w=1000&q=80',
  miradores:
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
};

/**
 * Returns a high quality photograph of the Budapest landmark based on title,
 * original name or category.
 */
export function getLandmarkPhoto(
  title: string,
  originalName?: string,
  category: string = 'pest'
): string {
  const normalized = `${title} ${originalName || ''}`.toLowerCase();

  // 1. Check direct keyword match
  for (const [key, url] of Object.entries(BUDAPEST_LANDMARK_PHOTOS)) {
    if (normalized.includes(key)) {
      return url;
    }
  }

  // 2. Try common landmark alias keywords
  if (normalized.includes('parlament') || normalized.includes('danubio')) {
    return BUDAPEST_LANDMARK_PHOTOS['parlamento'];
  }
  if (normalized.includes('pescador') || normalized.includes('halasz')) {
    return BUDAPEST_LANDMARK_PHOTOS['halaszbastya'];
  }
  if (normalized.includes('cadenas') || normalized.includes('puente')) {
    return BUDAPEST_LANDMARK_PHOTOS['puente-de-las-cadenas'];
  }
  if (normalized.includes('terma') || normalized.includes('baño') || normalized.includes('spa') || normalized.includes('furdo')) {
    return BUDAPEST_LANDMARK_PHOTOS['szechenyi'];
  }
  if (normalized.includes('ruin') || normalized.includes('bar') || normalized.includes('pub')) {
    return BUDAPEST_LANDMARK_PHOTOS['ruin-bars'];
  }
  if (normalized.includes('mirador') || normalized.includes('colina') || normalized.includes('vista')) {
    return BUDAPEST_LANDMARK_PHOTOS['colina-gellert'];
  }
  if (normalized.includes('iglesia') || normalized.includes('catedral') || normalized.includes('basilica')) {
    return BUDAPEST_LANDMARK_PHOTOS['basilica-de-san-esteban'];
  }
  if (normalized.includes('castillo') || normalized.includes('palacio')) {
    return BUDAPEST_LANDMARK_PHOTOS['castillo-de-buda'];
  }
  if (normalized.includes('museo') || normalized.includes('galeria') || normalized.includes('teatro')) {
    return BUDAPEST_LANDMARK_PHOTOS['galeria-nacional'];
  }

  // 3. Fallback to category hero photo
  return (
    CATEGORY_FALLBACK_PHOTOS[category] ||
    CATEGORY_FALLBACK_PHOTOS['pest']
  );
}
