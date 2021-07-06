export const subscriptions = new Map();

export function Subscribe(topic: string) {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ) => {
    subscriptions.set(topic, descriptor.value);

    return descriptor;
  };
}
