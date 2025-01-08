import { Weapon } from '../models/Weapon';

export function upgradeWeapon(weapon: Weapon): Weapon {
  weapon.damage += 2;

  return weapon;
}
