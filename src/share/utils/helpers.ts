import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { FavoriteEnum } from 'src/favorites/interface/favoriteTypes';
import { FavoriteStore } from 'src/favorites/interface/store';

export const removeFromResources = ({
  id,
  db,
  key,
  Model,
}: {
  id: string;
  key: string;
  db: InMemoryDBService<any>;
  Model: any;
}) => {
  const resources = db.query((resource) => resource[key] === id);
  console.log('resources', resources);
  if (resources.length) {
    resources.forEach((trackDto) => {
      const model = new Model(trackDto);
      const updatedModel = model.update({ [key]: null });
      console.log('updatedModel', updatedModel);

      db.update(updatedModel);
    });
  }
};

export const removeFromFavorites = ({
  id,
  db,
  type,
}: {
  type: FavoriteEnum;
  id: string;
  db: InMemoryDBService<FavoriteStore>;
}) => {
  const favs = db.getAll();
  const resources = favs.find((fav) => fav.id === type);

  const filteredIds = resources?.data?.filter((resource) => resource !== id);
  db.update({
    id: type,
    data: filteredIds ?? [],
  } as FavoriteStore);
};
