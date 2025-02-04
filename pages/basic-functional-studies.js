import {
  Heading,
  Javascript,
  Haskell,
  BlockQuote,
  Term,
  GlobalLayout,
  Title,
} from "../utils.js";

export default () => (

  <GlobalLayout>
    <Title text="Basic Functional Studies" />
    <p>
      In the previous post we observed some rules on how to get the most out of
      our functions. In this post we will do exactly that, get the most out of
      them. But rather than diving straight in to these techniques, we are going
      to come up with them ourselves. There is no better way to learn a concept
      than to arrive at it through simple steps. To see how we ourselves could
      have come up with these techniques.
    </p>
    <Heading size="2" text="Map, Getting Rid of 50% of For Loops" />
    <p>
      Let's imagine we need to add <Term>2</Term> to every single item in a list.
      How would we write this code? Perhaps something like this.
    </p>
    <Javascript>
    {`
      function add2ToList (list) {
          let temp = [];
          for (let i = 0; i < list.length; i++) {
              temp.push(list[i] + 2);
          }
          return temp;
      }

      add2ToList([1,2,3])
    `}
    </Javascript>
    <p>
      This function most certainly works. It does precisely what we asked. But it
      isn't very flexible. What if I want to add 3 to each item in the list? Well,
      I could go write a function called add3ToList, but that seems cumbersome, so
      instead let's make this function more generic.
    </p>
    <Javascript>
    {`
      function addNToList (n, list) {
          let temp = [];
          for (let i = 0; i < list.length; i++) {
              temp.push(list[i] + n);
          }
          return temp;
      }

      addNToList(n, [1,2,3])
    `}
    </Javascript>
    <p>
      Alright, problem solved. I can now add 3 or any number for that matter.
      Let's try a different problem. I want I have a list of string and I want to
      concatenate something onto the front of them. Here's what that function
      might look like.
    </p>
    <Javascript>
    {`
      function concatFrontList (s, list) {
          let temp = [];
          for (let i = 0; i < list.length; i++) {
              temp.push(s + list[i]);
          }
          return temp;
      }
      concatFrontList("hello, ", ["jimmy"])
    `}
    </Javascript>
    <p>
      Again, this certainly works, but doesn't it look remarkably similar to our
      addNToList? In fact, the name and one line are the only thing that changed.
      If we decide instead of concatenating we want to replace, or substring or
      any other operation we will have to write another function that is
      remarkable similar to this. Couldn't we write a function that abstracts over
      this?
    </p>
    <Javascript>
    {`
      const map = function (f, list) {
          let temp = [];
          for (let i = 0; i < list.length; i++) {
              temp.push(f(list[i));
          }
          return temp;
      }

      const add2 = function (n) {
          return n + 2;
      }

      const add3 = function (n) {
          return n + 3;
      }

      const greet = function (s) {
          return "hello " + s;
      }

      map(add2, [1,2,3]);
      // [3,4,5]
      map(add3, [1,2,3]);
      // [4,5,6]

      map(greet, ["jimmy"]);
      // "hello jimmy"
    `}
    </Javascript>
    <p>
      Map is that function. Map is a fairly interesting function, because one of
      its arguments is itself a function. This function is then applied to every
      element of the list. What we've done is extract out the essence of what we
      were doing in those other functions and made it reusable. This use of
      functions as arguments to other functions is called "higher order
      functions".
    </p>
    <Heading size="2" text="Partial application" />
    <p>
      Higher order functions allow us to abstract over behavior, not just data. We
      can extract out the essence of a certain transformation and allow the
      particulars to be passed in a function. But we still don't have the full
      reusability we would like to. You'll notice that we had to define two
      functions, add3 and add2 which basically do the same thing, let's see if
      generalizing this to addN does anything for us.
    </p>
    <Javascript>
    {`
      const addN = function (n, x) {
          return n + x;
      }

      const add2 = function(x) {
          return addN(2, x);
      }

      const add3 = function(x) {
          return addN(3, x);
      }

      map(add2, [1,2,3]);
      map(add3, [1,2,3]);
    `}
    </Javascript>
    <p>
      That's not really any better is it? The problem is map expects a function
      that takes one argument, but addN takes two. So we have to create functions
      that hard code some value of n and call addN underneath the hood. This
      really doesn't help our situation. But isn't there something we can do?W
      what if instead of writing those functions, addN just returned a function?
    </p>
    <Javascript>
    {`
      const addN = function (n) {
          return function (x) {
              return n + x;
          }
      }

      map(addN(2), [1,2,3]);
      map(addN(3), [1,2,3]);
    `}
    </Javascript>
    <p>
      There we go, no more extra function definitions. AddN is a function that
      returns a function. That way we can use it directly in our map call. But
      there is something that isn't very nice about this. First of all, it would
      be much messier if we had a function that took three arguments. Do we make
      it so they pass in two arguments and then finally the third? Do we make them
      pass one at a time? But really what isn't great here is the fact that what
      our addN is really supposed to do is obscured by the fact that we have to
      make it return a function. What if we could have our first addN definition
      but somehow make it return a function? We can using a method called partial
      application.
    </p>
    <Javascript>
    {`
      const add = function (a, b) {
          return a + b;
      }

      map(add.bind(null, 2), [1,2,3])
      map(add.bind(null, 3), [1,2,3])
    `}
    </Javascript>
    <p>
      Okay, now this probably seems a bit weird, what is this bind thing and why
      are you passing null as the first argument? Unfortunately, javascript
      doesn't support a beautiful way to do partial application, so we can use
      bind. Binds first argument is the "this" value of the function.
      Since we aren't using "this", we can set it to null. The rest of
      the arguments allow us to "bind" a value to one of the arguments
      of our function. In other words, when we say <Term>add.bind(null, 2)</Term>{" "}
      we are setting the "a" variable in add to 2 and then we are
      getting back a function that takes the rest of the arguments. In other words
      bind takes any function and turns it into a function that returns functions!
    </p>
    <Heading size="2" text="Currying" />
    <p>
      Partial application is actually incredibly useful. It can eliminate tons of
      code repetition. In future posts I guarantee we will see more uses of it
      will pop up, but there is actually a simply more powerful version of partial
      application. To see our problem let's change our add function to accept
      three variables.
    </p>
    <Javascript>
    {`
      const add = function (a, b, c) {
          return a + b + c;
      }
    `}
    </Javascript>
    <p>
      Now with partial application I can do all sorts of things, I can bind to
      "a", bind to "a" and "b", I could even bind to
      all three. But in order to do that, I have to explicitly call bind each
      time. So let's say I want to first bind "a" and then later
      "b", what will that look like.
    </p>
    <Javascript>
    {`
      const add2 = add.bind(null, 2);
      const add2Then3 = add2.bind(null, 3)
    `}
    </Javascript>
    <p>
      Not very pretty if you ask me. This also creates some weird cases, what will
      I get back if I call "add2(1)"? Since I only passed in one
      argument instead of the two remaining arguments "c" is undefined
      and thus the whole thing is. What I'd really love is to be able to pass in
      as many or as few arguments as I'd like and get back a function that takes
      the rest of them. This idea is called currying.
    </p>
    <Javascript>
    {`
      add(2)(3)(4)
      // 9
      add(2,3)(4)
      // 9
      add(2)(3, 4)
      // 9
      add(2,3,4)
      // 9
    `}
    </Javascript>
    <p>
      If we had a curried version of add, this is what we could do. Unfortunately
      currying isn't built into javascript by default, but it is available in the
      wonderful library lodash. Here's how we can use it.
    </p>
    <Javascript>
    {`
      let add = function (a,b,c) {
          return a + b + c;
      }
      add = _.curry(add);
    `}
    </Javascript>
    <p>
      Now our function is curried! How is this useful? Let me leave you with one
      more example.{" "}
    </p>
    <Javascript>
    {`
      let map = function (fn, list) {
          let temp = [];
          for (let i = 0; i < list.length; i++) {
              temp.push(f(list[i));
          }
          return temp;
      }
      map = _.curry(map);

      mapAdd2 = map(add(2))

      mapAdd2([1,2,3])
      // [3,4,5]
      mapAdd2([3,4,5])
      // [5,6,7]
    `}
    </Javascript>
    <p>
      Here we took our map function and curried it. Now with our curried add we
      can combine the two, giving us a new function, something that maps and adds
      two. With currying, our functions can serve as readily combinable building
      blocks, allowing us to easily define high level features.
    </p>
    <Heading size="2" text="Conclusion" />
    <p>
      Higher Order Functions allow us to extract the essence of a function out. We
      can get great reuse of our functions and work a higher abstraction. Currying
      allows us to take general functions and slowly add specificity. At every
      step, we are in control of what our functions do, what arguments they are
      applied to, and just how reusable they are. The basic functional techniques
      make our code cleaner and simpler. While these techniques come with a
      learning curve, they ultimately reduce the surface area of, decomplect, and
      simplify our code.
    </p>
  </GlobalLayout>
);