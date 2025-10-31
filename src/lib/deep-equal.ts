
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (obj1 === null || obj1 === undefined || obj2 === null || obj2 === undefined) {
    return obj1 === obj2;
  }

  const constructor1 = obj1.constructor;
  const constructor2 = obj2.constructor;
  if (constructor1 !== constructor2) {
    return false;
  }

  if (constructor1 === Array) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true;
  }

  if (constructor1 === Object) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
  }
  
  if (constructor1 === Date) {
      return obj1.getTime() === obj2.getTime();
  }

  return false;
}
