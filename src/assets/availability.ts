import type {ResourceId} from './manifest';
/** DOM art needs URLs and missing status, independent of renderer ownership. */
export class ResourceAvailability {
 private forced=new Set<ResourceId>();
 readonly failures=new Set<ResourceId>();
 forceMissing(id:ResourceId,missing:boolean){if(missing)this.forced.add(id);else this.forced.delete(id);}
 isMissing(id:ResourceId){return this.forced.has(id)||this.failures.has(id);}
}
export const artAvailability=new ResourceAvailability();
