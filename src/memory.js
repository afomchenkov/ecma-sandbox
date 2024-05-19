document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');

  refsCountExample();
  circularRefsExample();
  markAndSweepExample();
});

/**
 * Reference-counting garbage collection
 *
 * - No modern JavaScript engine uses reference-counting for garbage collection anymore.
 */
function refsCountExample() {
  let x = {
    a: {
      b: 2,
    },
  };
  // 2 objects are created. One is referenced by the other as one of its properties.
  // The other is referenced by virtue of being assigned to the 'x' variable.
  // Obviously, none can be garbage-collected.

  let y = x;
  // The 'y' variable is the second thing that has a reference to the object.

  x = 1;
  // Now, the object that was originally in 'x' has a unique reference embodied by the 'y' variable.

  let z = y.a;
  // Reference to 'a' property of the object.
  // This object now has 2 references: one as a property, the other as the 'z' variable.

  y = "mozilla";
  // The object that was originally in 'x' has now zero references to it. It can be garbage-collected.
  // However its 'a' property is still referenced by the 'z' variable, so it cannot be freed.

  z = null;
  // The 'a' property of the object originally in x has zero references to it. It can be garbage collected.
}

// the reference-counting algorithm will not consider them reclaimable since each of the two objects has
// at least one reference pointing to them, resulting in neither of them being marked for garbage collection.
// Circular references are a common cause of memory leaks.
function circularRefsExample() {
  function f() {
    const x = {};
    const y = {};
    x.a = y; // x references y
    y.a = x; // y references x

    return 'something';
  }

  f();
}

/**
 * Mark-and-sweep algorithm
 *
 * - This algorithm reduces the definition of "an object is no longer needed" to "an object is unreachable".
 * - Currently, all modern engines ship a mark-and-sweep garbage collector.
 *
 *
 * This algorithm assumes the knowledge of a set of objects called roots. In JavaScript, the root is the
 * global object. Periodically, the garbage collector will start from these roots, find all objects that
 * are referenced from these roots, then all objects referenced from these, etc. Starting from the roots,
 * the garbage collector will thus find all reachable objects and collect all non-reachable objects.
 *
 * The immediate benefit of this approach is that cycles are no longer a problem. In the first example above,
 * after the function call returns, the two objects are no longer referenced by any resource that is
 * reachable from the global object. Consequently, they will be found unreachable by the garbage collector
 * and have their allocated memory reclaimed.
 */
function markAndSweepExample() {
  function f() {
    const x = {};
    const y = {};
    x.a = y; // x references y
    y.a = x; // y references x

    return 'something';
  }

  // even though objects reference each other, they are unreachable and can be garbage collected

  f();
}

/**
 * WeakMap and WeakSet are data structures whose APIs closely mirror their non-weak counterparts: Map and Set.
 * WeakMap allows you to maintain a collection of key-value pairs, while WeakSet allows you to maintain a collection
 * of unique values, both with performant addition, deletion, and querying.
 *
 * WeakMap and WeakSet got the name from the concept of weakly held values. If x is weakly held by y, it means
 * that although you can access the value of x via y, the mark-and-sweep algorithm won't consider x as reachable
 * if nothing else strongly holds to it.
 *
 * Most data structures, except the ones discussed here, strongly holds to the objects passed in so that you can
 * retrieve them at any time. The keys of WeakMap and WeakSet can be garbage-collected (for WeakMap objects, the
 * values would then be eligible for garbage collection as well) as long as nothing else in the program is
 * referencing the key
 *
 * - WeakMap and WeakSet can only store objects or symbols.
 * - WeakMap and WeakSet are not iterable.
 *
 * It's often implied that the key is garbage-collected first, freeing the value for garbage collection as well.
 */
function weakMapSetExamples() {
  // Now `key` cannot be garbage collected, because the value holds a
  // reference to the key, and the value is strongly held in the map!
  const wm = new WeakMap();
  const key = {};
  wm.set(key, { key });


  // Rough example implementation
  //
  // As you can see, the MyWeakMap never actually holds a collection of keys. It simply
  // adds metadata to each object being passed in. The object is then garbage-collectable via mark-and-sweep.
  class MyWeakMap {
    #marker = Symbol('MyWeakMapData');
    get(key) {
      return key[this.#marker];
    }
    set(key, value) {
      key[this.#marker] = value;
    }
    has(key) {
      return this.#marker in key;
    }
    delete(key) {
      delete key[this.#marker];
    }
  }

}

// WeakRefs and FinalizationRegistry
