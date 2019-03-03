
# Example step-by-step solution

## Step 0 - Setup

Mainly just following the [Readest guide](https://readest.codaisseur.com/courses/intermediate-bootcamp/09-redux/03-react-redux/01-setup).

#### Install `create-react-app`

```bash
npm install -g create-react-app
```

Of course you pribably didn't have to reinstall this guy, because we did so earlier this week. But I'll list it for compleness' sake anyway.

#### Make a new React app with it:

```bash
create-react-app hw3
```

This step always take a while, because it has to install quite some dependencies (packages). When it's done, we have a folder structure like this (inside `hw3`):

```bash
.git # because `creact-react-app` also initialized the folder as a git repo
.gitignore
node_modules
package.json # dependencies, `npm run XYZ` scripts, and some more configuration
package-lock.json
public/ # some static app assets and stuff
src/ # <-- the source code for your app
```

The `.gitignore` file will blacklist the `node_modules` folder (amongst others) from being included in your git repo.

3. While I'm performing the next steps, I either keep `npm run start` running, or check whether the application will `npm run start` periodically (when making bigger changes).

```bash
npm run start
```

#### Install and start using Redux (and React-Redux):

```bash
npm install redux react-redux --save
```

(I believe the reader forgot to add the `--save` part, that actually saves the dependencies to your `package.json` file.)

#### Redux setup

Create the Redux store entry-point `src/store.js`:

```diff
+import { createStore } from 'redux'
+import reducer from './reducer'
+
+const store = createStore(reducer)
+
+export default store
```

Create the initial reducer `src/reducer.js`:

```diff
+const reducer = (state = [], action = {}) => {
+  switch (action.type) {
+  default:
+    return state
+  }
+}
+
+export default reducer
```

#### React-Redux integration

Tell `src/index.js` that you want to use Redux:

```diff
 import React from 'react';
 import ReactDOM from 'react-dom';
 import './index.css';
 import App from './App';
 import * as serviceWorker from './serviceWorker';
+import store from './store'
+import { Provider } from 'react-redux'

-ReactDOM.render(<App />, document.getElementById('root'));
+ReactDOM.render(
+  <Provider store={store}>
+    <App />
+  </Provider>,
+  document.getElementById('root')
+);

 // If you want your app to work offline and load faster, you can change
 // unregister() to register() below. Note this comes with some pitfalls.
 // Learn more about service workers: http://bit.ly/CRA-PWA
 serviceWorker.unregister();
```

Running `npm run start` now (or if you still have it running, then that's wonderful), should not give anny errors (any more).

#### Enabling Redux DevTools

In `src/store.js`:

```diff
 import { createStore } from 'redux'
 import reducer from './reducer'

+const enhancer = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
+
+const store = createStore(reducer, enhancer)
-const store = createStore(reducer)

 export default store
```

#### Cleaning up `App.js`

In `src/App.js`:

```diff
 import React, { Component } from 'react';
 import logo from './logo.svg';
 import './App.css';
 
 class App extends Component {
   render() {
     return (
       <div className="App">
+        clean!
-        <header className="App-header">
-          <img src={logo} className="App-logo" alt="logo" />
-          <p>
-            Edit <code>src/App.js</code> and save to reload.
-          </p>
-          <a
-            className="App-link"
-            href="https://reactjs.org"
-            target="_blank"
-            rel="noopener noreferrer"
-          >
-            Learn React
-          </a>
-        </header>
       </div>
     );
   }
 }
 
 export default App;
```

#### Commit

For future reference's sake, let's commit this step to history!

```bash
git add .
git commit -m "step0-added-redux"
```


## Step 1 - Render some elements

OK, so we're supposed to show a `<select>` which is filled automatically (i.e. React-style) with the given data object. Note how you're not told where to actually put the JavaScript data object. For now, even though we might be refactoring it in some next step, let's just put it plainly at the top scope of our `src/App.js` file.

```diff
...
 import './App.css';
 
+const data = {
+  "Ivel Z3": {
+    manufacturer: "Ivasim",
+    year: 1969,
+    origin: "Croatia"
+  },
+  "Bally Astrocade": {
+    manufacturer: "Bally Consumer Products",
+    year: 1977,
+    origin: "USA"
+  },
+  "Sord M200 Smart Home Computer": {
+    manufacturer: "Sord Computer Corporation",
+    year: 1971,
+    origin: "Japan"
+  },
+  "Commodore 64": {
+    manufacturer: "Commodore",
+    year: 1982,
+    origin: "USA"
+  }
+}
 
 class App extends Component {
   render() {
...
```


Then, let's render the desired `<select>` element. First, as a _sanity check_, let us add the select, and the "pick a model" option:

```diff
...
       <div className="App">
         <select>
-          clean!
+          <option>-- pick a model --</option>
        </select>
      </div>
...
```

Now, we're faced with the problem of how to iterate through an object, where we usually would just use a `map` to interate over an array. The one-stop solution (if we don't care about order!) is to use `Object.entries`, like so:

```diff
...
       <div className="App">
         <select>
           <option>-- pick a model --</option>
+          {Object.entries(data).map(entry =>
+            <option value={entry[0]}>{entry[1]}</option>
+          )}
         </select>
       </div>
...
```

In fact, this gave me an error at first. The reason for the error was that `entry[1]` would be the computer model _object_ in question, i.e. something like `{ manufacturer: "...", year: ..., origin: "..." }`. The error in question read, literally:

> ```
> Objects are not valid as a React child (found: object with keys {manufacturer, year, origin}). If you meant to render a collection of children, use an array instead.
>     in option (at App.js:35)
>     in select (at App.js:32)
>     in div (at App.js:31)
>     in App (at src/index.js:11)
>     in Provider (at src/index.js:10)
> ```

Note how the error was actually quite descriptive, and also stated the precise location it found the error (in `App.js` at line 35). Errors are not always spot-on in their description, but if they are, that's a great help! Learn to read them :)

So then, I noticed that indeed we're supposed to transform these computer model objects to something descriptive like "Sord M200 Smart Home Computer (1971)", including the model's year and name. Also, note the new use of destructuring syntax in the anonymous function's only parameter.

```diff
...
       <div className="App">
         <select>
           <option>-- pick a model --</option>
-          {Object.entries(data).map(entry =>
-            <option value={entry[0]}>{entry[1]}</option>
-          )}
+          {Object.entries(data).map(([name, data]) =>
+            <option value={name}>{name} ({data.year})</option>
+          )}
         </select>
       </div>
...
```

Finally, I checked the actually rendered HTML in Chrome's DevTools, to see that it did indeed match the exercises' expected output.

#### Commit

For future reference's sake, let's commit this step to history!

```bash
git add .
git commit -m "step1-added-dropdown"
```


## Step 2 - Event handling and local state

Now we're supposed to change the select element into a **controlled component**, which means that it will always be _in sync_ with our component's state. (Currently, this is not the case: when the user selects a different computer model from the dropdown, this is not registered anywhere except the DOM.)

#### Adding the `updateSelection` event handler

Just following the lead of the [React docs page on forms](https://reactjs.org/docs/forms.html), I add the following code to check whether the `onChange` prop indeed works, and if so, what kind of data is passed to it:

```diff
...
 class App extends Component {
 
+  updateSelection (event) {
+    console.log("select change event", event)
+  }
+
   render() {
     return (
       <div className="App">
-        <select>
+        <select onChange={this.updateSelection}>
           <option>-- pick a model --</option>
...
```

Changing the dropdown's selection, the DevTools console shows:

> ```
> select change event
> SyntheticEvent
> ```

Not incredibly enlightening, but let's continue, who knows:

```diff
...
 class App extends Component {
 
   updateSelection (event) {
-    console.log("select change event", event)
+    console.log("select change event", event.target)
   }
 
   render() {
     return (
       <div className="App">
         <select onChange={this.updateSelection}>
           <option>-- pick a model --</option>
...
```

Ah! This time, the DevTools console shows:

> ```
> select change event
> ▶ <select></select>
> ```

...and that `<select></select>` is indeed the DOM node that is our dropdown.

Now it makes sense that the `this.setState({value: event.target.value});` line on the React docs page would work. So let's record it in component state, but at least save it under a more sensible name!

```diff
...
 class App extends Component {
 
+  state = {
+    selectedModel: "",
+  }
+
   updateSelection (event) {
-    console.log("select change event", event.target)
+    console.log("select change event", event.target, event.target.value)
+    this.setState({ selectedModel: event.target.value })
   }
 
   render() {
     return (
       <div className="App">
         <select onChange={this.updateSelection}>
           <option>-- pick a model --</option>
           {Object.entries(data).map(([name, data]) =>
             <option value={name}>{name} ({data.year})</option>
...
```

Things are not that easy! React complains a whole awful lot, but it's final verdict (the error shows in big letters on the app's page) is:

> ```
> TypeError: Cannot read property 'setState' of undefined
> updateSelection
> src/App.js:41:6
> (etc...)
> ```

Luckily, we've learned about this kind of problem!

Even though the line-number indication of the error (line 41 in `src/App.js`) is quite off, we know how to understand the error. The error reads "Cannot read property 'setState' of undefined", which means that JavaScript thinks that `this` in the line containing `this.setState(...)` is `undefined`. This should raise alarm bells: `this` being `undefined` ⇨ let's use a fat arrow function, so that JavaScript knows how to understand what `this` is supposed to refer to!

There are two ways we could start using a fat arrow: (1) in the callback (`onChange={event => this.updateSelection(event)}`), or (2) when defining `updateSelection`. The second has my slight preference:

```diff
...
     selectedModel: "",
   }
 
-  updateSelection (event) {
+  updateSelection = (event) => {
     console.log("select change event", event.target, event.target.value)
     this.setState({ selectedModel: event.target.value })
...
```

And it works! Using the React DevTools, we can see that the state is being updated correctly:

![](https://cd.sseu.re/React_App_2019-03-03_14-21-00.png)


We've forgotted one step though: we want to have the dropdown _read_ it's currently selected value from state as well. This way, we accomplish a _two-way_ synchronization between the dropdown's selection, and the component's state. Why? Because then if we change the state by some other means, later on, the dropdown will also automatically update.

```diff
...
     return (
       <div className="App">
-        <select onChange={this.updateSelection}>
+        <select value={this.state.selectedModel} onChange={this.updateSelection}>
           <option>-- pick a model --</option>
...
```

This one's harder to test by hand, but we still can. In the React DevTools, you can manually change the `selectedModel` state. If you type in `"Ivel Z3"`, you should see the dropdown automatically select that option.

#### Commit

For future reference's sake, let's commit this step to history!

```bash
git add .
git commit -m "step1-controlled-dropdown"
```


## Step 2 - Redux actions

This step is actually not that hard code-technically speaking, but it can be quite hard to understand all the pieces involved, how things tie together, and where yo put your code.

When the exercise asks you to "Define a new action type", it does not mean that you need to add some JavaScript variable declaration of sorts to your code. In fact, all that is needed is that the store's reducer _knows this action type_, and can deal with it. This means adding a few lines of code to `src/reducer.js`. For now, let's just see whether these lines of code are reached, by added a diagnostic `console.log` statement:

```diff
 const reducer = (state = [], action = {}) => {
   switch (action.type) {
+  case 'ADD_MODEL': {
+    console.log("add model!", state, action)
+    return state
+  }
   default:
     return state
   }
 }
 
 export default reducer
```

Then, let's add a button to `App.js` that actually initiated that action. The first step is to actually connect the `App` component to the React store with `connect()`. We don't need to specify any _store-state-to-props_ function just yet, just using `connect()` already will allow us to get the special prop called `dispatch` that we will use (from inside `App`) to call the action.

Here's what we change to `App.js`:

```diff
 import logo from './logo.svg';
 import './App.css';
+import { connect } from 'react-redux';
 
 const data = {
...
...

-export default App;
+export default connect()(App);
...
```

And here's the effect, in React DevTools: you can now see that the `App` component gets a `dispatch` prop.

![](https://cd.sseu.re/React_App_2019-03-03_14-50-29.png)

Even though technically not strictly necessary, let's add the logic for dispatching this action into a new method in `App`. Who knows, maybe in the future we'll need to surround the action call with some more logic: then that method would be a good place to put the extra logic.

```diff
...
     this.setState({ selectedModel: event.target.value })
   }
 
+   addSelectedModel = () => {
+     console.log("hello!", this.state.selectedModel, data[this.state.selectedModel])
+     this.props.dispatch({
+       type: 'ADD_MODEL',
+       payload: data[this.state.selectedModel]
+     })
+   }
+ 
   render() {
...
...
           )}
         </select>
+        <button onClick={this.addSelectedModel}>Add it!</button>
       </div>
     );
...
```

Now, we can see that the action is indeed dispatched, and the reducer's code is run:

![](https://cd.sseu.re/React_App_2019-03-03_15-03-57.png)

There's still a small 'bug' in our code though: if we haven't currently selected any computer model in the dropdown, what will be dispatched? An action without a payload:

![](https://cd.sseu.re/React_App_2019-03-03_15-01-18.png)

So let's add a small check that prevents this:

```diff
...
   addSelectedModel = () => {
-    console.log("hello!", this.state.selectedModel, data[this.state.selectedModel])
-    this.props.dispatch({
-      type: 'ADD_MODEL',
-      payload: data[this.state.selectedModel]
-    })
+    if (data[this.state.selectedModel]) {
+      this.props.dispatch({
+        type: 'ADD_MODEL',
+        payload: data[this.state.selectedModel]
+      })
+    }
   }
...
```

One more thing! I totally forgot to actually add the model! Even though the reducer did get the computer model, it didn't actually add the object to the store's state. So let's fix that.

```diff
...
   case 'ADD_MODEL': {
     console.log("add model!", state, action)
+    return [ ...state, action.payload ]
-    return state
   }
   default:
...
```

Using the Redux DevTools, we can see that the store's state is indeed increased every time we click the button.

#### Commit

For future reference's sake, let's commit this step to history!

```bash
git add .
git commit -m "step3-dispatching-redux-action"
```


## Step 4 - Reading from the Redux state

Now, let's not only dispatch events to the store, but also retrieve data from it. In order to do that, we need to _connect the store's state to the props that `App` receives_. I.e., write a `mapStateToProps` function and pass it to the `connect` call that we already have in place.

Interestingly, our current store state is just an array. This means that we'll have to put just a little bit of actual logic into the `mapStateToProps` function, because it needs to return an object of props:

```diff
...
+function mapStateToProps (state) {
+  return {
+    computerList: state
+  }
+}
+
-export default connect()(App);
+export default connect(mapStateToProps)(App);
```

Even before we get to displaying the list, we can already see that the mapping has worked, because in the React DevTools we can see that the app indeed now get the prop `computerList`:

![](https://cd.sseu.re/React_App_2019-03-03_15-19-16.png)

Let's display the list now. We'll start this process "in reverse", as it were, by first adding some code to the `render()` method of `App`. This way, we know exactly what we want from this new component, and then we can go ahead and write it.

```diff
   render() {
     return (
       <div className="App">
+        <h2>List:</h2>
+        {this.props.computerList.map(model =>
+          <ModelDetails model={model} />
+        )}
+        <h2>Add a new computer:</h2>
         <select value={this.state.selectedModel} onChange={this.updateSelection}>
           <option>-- pick a model --</option>
```

Apparently (obviously?), the `ModelDetails` component should receive the specs of the model. Writing out the _usage_ of the component, we've figured out what props we want to give it. Namely, one prop: `model`. Note that you could also have done this differently: you could have named the prop differently, or you could have passed the specs via a spread: `<ModelDetails {...model} />`, which would have had the effect that the `ModelDetails` component would receive three props: `manufacturer`, `origin`, and `year`.

The exercise wants us to write the `ModelDetails` component as a **presentational component**, meaning that it doesn't know anything else than it's props, and is not concerned with anything else than _presenting data_. For code organization purposes, we'll put this new component under a new folder `src/components`.

```diff
+import React, { Component } from 'react';
+
+class ModelDetails extends Component {
+  
+  render() {
+    const model = this.props.model;
+    return (
+      <div>
+        <ul>
+          <li>Name: {model.name}</li>
+          <li>Manufacturer: {model.manufacturer}</li>
+          <li>Year: {model.year}</li>
+          <li>Origin: {model.origin}</li>
+        </ul>
+      </div>
+    );
+  }
+}
+
+export default ModelDetails;
```

And we import it in `App.js`:

```diff
...
 import './App.css';
 import { connect } from 'react-redux';
 
+import ModelDetails from './components/ModelDetails';
+
 const data = {
   "Ivel Z3": {
...
```

It pretty much completely works! There's just one problem: we don't have access to the "name" of the model inside of the `ModelDetails` component. If you think about it, we've completely left out the model's name from the store's state. Instead, the `App` component just stored the model's specs/details object to the store, not the name of the model itself. Let's change that:

```diff
...
       this.props.dispatch({
         type: 'ADD_MODEL',
-        payload: data[this.state.selectedModel]
+        payload: {
+          ...data[this.state.selectedModel],
+          name: this.state.selectedModel
+        }
       })
     }
   }
 
   render() {
     return (
...
```

And it's done!

One small thing though, the exercise also wants us to use the "prop-types" package to annotate our props inside of `ModelDetails`. The reason why one would go through the extra effort of adding such annotations to otherwise working code is to ensure that, whatever happens in the future, you'll get errors in the props a component receives change. This could be a sloppy programmer editing `App.js`, or some other kind of mistake, in the redux store for example. By getting these errors, you can solve the problem directly, instead of only figuring out later.

First, we need to install `prop-types` (and save the dependency!):

```bash
npm install prop-types --save
```

And then annotate `ModelDetails`:

```diff
 import React, { Component } from 'react';
+import PropTypes from 'prop-types';
 
 class ModelDetails extends Component {
 
+  static propTypes = {
+    model: PropTypes.shape({
+      name: PropTypes.string.isRequired,
+      manufacturer: PropTypes.string.isRequired,
+      year: PropTypes.number.isRequired,
+      origin: PropTypes.string.isRequired,
+    }).isRequired
+  }
+
   render() {
     const model = this.props.model;
...
```

To check whether this addition had any effect, I reverted the previous edit in the `addSelectedModel` method of `App`, so that the name is not stored in the Redux store. And then, indeed, I get an error:

![](https://cd.sseu.re/React_App_2019-03-03_15-46-03.png)

It's the second error that I'm referring to, of course. The first has to do with rendering arrays of things. Let's fix that too, by the way. The error message tells us how to: just add a `key` prop to whatever is being rendered inside of the `map`. (This `key` prop is not "for ourselves", but rather "for React", so it knows how to re-arrange the DOM properly/efficiently.) There are two places where we render an array of things: (1) in the dropdown, (2) in the list of computer models, so we have to fix both.

The first is easy, becase the "name" of the model uniquely identifies it.

```diff
...
           <option>-- pick a model --</option>
           {Object.entries(data).map(([name, data]) =>
-            <option value={name}>{name} ({data.year})</option>
+            <option key={name} value={name}>{name} ({data.year})</option>
           )}
         </select>
...
```

The second is a bit harder, because it can happen that we add the same model multiple times to the list. In this case, there's not really much "unique stuff" to go on, and we'll actually not be able to help React out much (or not at all). But at least let's suppress the error message, by passing the array index as a key:

```diff
...
         <h2>List:</h2>
-        {this.props.computerList.map(model =>
-          <ModelDetails model={model} />
+        {this.props.computerList.map((model, i) =>
+          <ModelDetails key={i} model={model} />
         )}
         <h2>Add a new computer:</h2>
...
```


#### Commit

For future reference's sake, let's commit this step to history!

```bash
git add .
git commit -m "step4-reading-redux-state"
```
