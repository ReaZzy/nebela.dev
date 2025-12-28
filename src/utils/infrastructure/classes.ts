type AnyCtor = new (...args: any[]) => any;
export type Constructor<
  Params extends unknown = unknown,
  Instance extends unknown = unknown,
> = new (params: Params) => Instance;
export function createFromConstructor<Constructor extends AnyCtor>(
  ctor: Constructor,
  params: ConstructorParameters<Constructor>[0]
): InstanceType<Constructor> {
  return new ctor(params);
}
