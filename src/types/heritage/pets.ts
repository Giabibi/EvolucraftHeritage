import fs from "fs";
import path from "path";

const HERITAGE_ROLE_ID = "1382036311724134400";
const HERITAGE_PETS_PATH = path.join(
    __dirname,
    "../../../data/heritage/pets.json"
);

type HeritagePet = {
    name: string;
    level: number;
};

const saveHeritagePets = (pets: HeritagePet[]) => {
    fs.writeFileSync(HERITAGE_PETS_PATH, JSON.stringify(pets, null, 4));
};

export { HERITAGE_ROLE_ID, saveHeritagePets };
