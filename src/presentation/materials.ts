import type {EnemyKind,FragmentMaterial} from '../types';
/** Presentation metadata only; does not participate in damage or collision. */
export const ENEMY_MATERIALS:Record<EnemyKind,FragmentMaterial>={
 homework:'paper',checkin:'metal',ppt:'paper',review:'paper',receipt:'paper',ddl:'metal',
 advisor:'metal',proposal:'paper',defense:'paper',finals:'paper',math:'key',english:'key',
 coding:'code',mechanics:'metal',thrower:'paper',charger:'metal',splitter:'paper',bomber:'glass',
 summoner:'code',guard:'metal',leader:'blueprint',inspector:'glass',teamlead:'metal',node:'glass',examCharger:'metal',
};
export function enemyMaterial(kind:EnemyKind):FragmentMaterial{return ENEMY_MATERIALS[kind];}
