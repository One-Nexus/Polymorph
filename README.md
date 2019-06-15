[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/One-Nexus/Polymorph/blob/master/LICENSE)
[![Inline docs](http://inch-ci.org/github/One-Nexus/Polymorph.svg?branch=master)](http://inch-ci.org/github/One-Nexus/Polymorph)
[![Build Status](https://travis-ci.com/One-Nexus/Polymorph.svg?branch=master)](https://travis-ci.com/One-Nexus/Polymorph)
[![npm version](https://badge.fury.io/js/%40onenexus%2Fpolymorph.svg)](https://www.npmjs.com/package/@onenexus/polymorph)
[![npm downloads](https://img.shields.io/npm/dm/@onenexus/polymorph.svg)](https://www.npmjs.com/package/@onenexus/polymorph)
[![codecov](https://codecov.io/gh/One-Nexus/Polymorph/branch/master/graph/badge.svg)](https://codecov.io/gh/One-Nexus/Polymorph)

> Style Synergy modules/BEM DOM elements using JavaScript

<img height="56px" src="http://www.onenexus.io/polymorph/images/polymorph-logo.png" />

* [Overview](#overview)
* [Installation & Setup](#installation--setup)
* [Synergy Modules/Components](https://github.com/One-Nexus/Synergy/wiki/Modules,-Components-and-Modifiers)
* [polymorph()](https://github.com/One-Nexus/Polymorph/wiki/Polymorph())
* [API](#api)
* [Use With sQuery](#use-with-squery)
* [Use With Lucid](#use-with-lucid)

## Overview

Polymorph is used for styling DOM elements that follow the [Synergy naming convention](https://github.com/One-Nexus/Synergy-Front-End-Guides/wiki/Synergy-Values#synergy-naming-convention).

> [Learn how to integrate with React components](https://github.com/One-Nexus/Polymorph/wiki/Working-With-React)

> [View a live demo using React + Polymorph](https://codesandbox.io/s/95k4y)

###### Example Module Markup

```html
<div class="accordion">
    <div class="accordion_panel">
        <div class="accordion_title">foo</div>
        <div class="accordion_content">bar</div>
    </div>
    <div class="accordion_panel-active">
        <div class="accordion_title">fizz</div>
        <div class="accordion_content">buzz</div>
    </div>
</div>
```

> [Learn more about Synergy modules](https://github.com/One-Nexus/Synergy/wiki/Modules,-Components-and-Modifiers#modules)

###### Style all `accordion` modules

```jsx
document.querySelectorAll('.accordion').forEach(element => {
    polymorph(element, {
        'position': 'relative'
    });
});
```

###### Style `panel` components

> [Learn more about Synergy Components](https://github.com/One-Nexus/Synergy/wiki/Modules,-Components-and-Modifiers#components)

```jsx
document.querySelectorAll('.accordion').forEach(element => {
    polymorph(element, {
        panel: {
            'display': 'block'
        }
    });
});
```

###### Style `panel` components with `active` modifier

```jsx
document.querySelectorAll('.accordion').forEach(element => {
    polymorph(element, {
        panel: {
            'color': 'white',

            'modifier(active)': {
                'color': 'blue'
            }
        }
    }
});
```

###### Alternatively

```jsx
document.querySelectorAll('.accordion').forEach(element => {
    polymorph(element, {
        panel: panel => ({
            'color': panel.matches('.accordion_panel-active') ? 'blue' : 'white'
        })
    }
});
```

###### Using In-Built `modifier` Method

> This ensures no class names are hard coded

> [Learn more](#polymorphmodifier) about the `modifier` method

```jsx
document.querySelectorAll('.accordion').forEach(element => {
    polymorph(element, {
        panel: panel => ({
            'color': polymorph.modifier(panel, 'active') ? 'blue' : 'white'
        })
    }
});
```

###### Using `sQuery` (Recommended)

> [Learn more about sQuery](https://github.com/One-Nexus/sQuery/wiki)

```jsx
sQuery('accordion', element => {
    polymorph(element, {
        panel: panel => ({
            'color': panel.modifier('active') ? 'blue' : 'white'
        })
    }
});
```

###### Style `title` components when parent `panel` component has `active` modifier

```jsx
document.querySelectorAll('.accordion').forEach(element => {
    polymorph(element, {
        panel: {
            'modifier(active)': {
                title: {
                    'color': 'red'
                }
            }
        },
        title: {
            'color': 'blue'
        }
    }
});
```

###### Alternatively

```jsx
document.querySelectorAll('.accordion').forEach(element => {
    polymorph(element, {
        title: title => ({
            'color': title.closest('.accordion_panel-active') ? 'red' : 'blue'
        })
    }
});
```

###### Using sQuery

> [Learn more about sQuery](https://github.com/One-Nexus/sQuery/wiki)

```jsx
sQuery('accordion', element => {
    polymorph(element, {
        title: title => ({
            'color': title.parent('panel').is('active') ? 'red' : 'blue'
        })
    }
});
```

## Installation & Setup

```
npm install --save @onenexus/polymorph
```

```jsx
import 'polymorph' from '@onenexus/polymorph';

polymorph(document.getElementById('someElement'), someConfigurationObject);
```

> Using BEM? Checkout the [Working With BEM](https://github.com/One-Nexus/Polymorph/wiki/Working-With-BEM) page

## API

* [Polymorph.modifier()](#polymorphmodifier)
* [Element.repaint()](#elementrepaint)

### Polymorph.modifier()

> Determine if an HTML element has the specified modifier

```jsx
polymorph.modifier(element, modifier)
```

<table class="table">
    <thead>
        <tr>
            <th>Param</th>
            <th>Type</th>
            <th>Info</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>element</code></td>
            <td><code><a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement">HTMLElement</a></code></td>
            <td>The HTML element of interest</td>
        </tr>
        <tr>
            <td><code>modifier</code></td>
            <td><code>String</code></td>
            <td>The modifier of interest</td>
        </tr>
    </tbody>
</table>

##### Example

```html
<div class="accordion">
    <div class="accordion_panel">
        <div class="accordion_title">foo</div>
        <div class="accordion_content">bar</div>
    </div>
    <div class="accordion_panel-active">
        <div class="accordion_title">fizz</div>
        <div class="accordion_content">buzz</div>
    </div>
</div>
```

```jsx
document.querySelectorAll('.accordion').forEach(element => {
    polymorph(element, {
        panel: panel => ({
            'color': polymorph.modifier(panel, 'active') ? 'blue' : 'white'
        })
    }
});
```

###### Result

```html
<div class="accordion">
    <div class="accordion_panel" style="color: white;">
        ...
    </div>
    <div class="accordion_panel-active" style="color: blue;">
        ...
    </div>
</div>
```

### Element.repaint()

> Repaint the module by re-applying the style rules

```jsx
element.repaint()
```

> This method is attached directly to the DOM element after the initial `polymorph` call

This is useful for updating the styles after an event that modifies the DOM, such as a click event which adds an `active` modifier to an element. In order to repaint the element, you should call the `repaint()` method in the same place you handle the event.

###### Example

```html
<div class="accordion" id="alpha">
    <div class="accordion_panel">
        <div class="accordion_title">foo</div>
        <div class="accordion_content">bar</div>
    </div>
    <div class="accordion_panel">
        <div class="accordion_title">fizz</div>
        <div class="accordion_content">buzz</div>
    </div>
</div>
```

```jsx
polymorph(document.getElementById('alpha'), {
    panel: {
        'background': 'red';

        'modifier(active)': {
            'background': 'blue'
        }
    }
});

// `#alpha` element and all targeted child components
//  will now have a `repaint()` method
```

```jsx
document.querySelectorAll('.accordion').forEach(accordion => {
    accordion.querySelectorAll('.accordion_panel').forEach(panel => {
      panel.querySelector('.accordion_title').addEventListener('click', () => {
        // do event handling...
        panel.classList.toggle('accordion_panel-active');
        
        // repaint the accordion panel
        panel.repaint();
      });
    }
});
```

###### Using [sQuery](https://github.com/One-Nexus/sQuery)

```jsx
sQuery('accordion').getComponents('panel').forEach(PANEL => {
    sQuery(PANEL).getComponent('title').addEventListener('click', () => {
        // the `repaint` method is called automatically
        // when using the sQuery API
        sQuery(PANEL).toggleModifier('visible');
    });
});
```

###### Using [Lucid](https://github.com/One-Nexus/Lucid)

```jsx
// By passing a styles function/object to the `styles` prop of `<Module>`,
// `repaint()` will be called on the approprate rendered DOM elements
//  in the `componentDidUpdate` lifecycle method
<Module name='myModule' styles={styles}>...</Module>
```

## Use With sQuery

> [sQuery](https://github.com/One-Nexus/sQuery) is a JavaScript library for interacting with Synergy modules

sQuery is perfect for interacting with `Polymorph`, and isn't included by default to keep bundle size down (as it isn't strictly required for functionality).

Once installed, you can use sQuery to style your modules and components much more easily using the [provided API](https://github.com/One-Nexus/sQuery/wiki#api).

###### Without sQuery

```jsx
document.querySelectorAll('.accordion').forEach(element => {
    polymorph(element, {
        title: title => ({
            'color': title.closest('.accordion_panel-active') ? 'red' : 'blue'
        })
    }
});
```

###### With sQuery

```jsx
sQuery('accordion', element => polymorph(element, {
    title: title => ({
        'color': title.parent('panel').is('active') ? 'red' : 'blue'
    })
}));
```

## Use With Lucid

> [Lucid](https://github.com/One-Nexus/Lucid) is a set of higher-order React components for rendering Synergy modules

Lucid and Polymorph were built in tandem as part of the [`Synergy` framework](https://github.com/One-Nexus/Synergy), so go hand-in-hand together. If you are using Lucid, the easiest way to use Polymorph as the [`styleParser`](https://github.com/One-Nexus/Lucid/wiki/Module#propsstyleparser) function is to attach it to the `window.Synergy.styleParser` property:

```js
import { Module, Component } from '@onenexus/lucid';
import Polymorph from '@onenexus/polymorph';

window.Synergy = {
    styleParser: Polymorph
}

// start using Lucid components (Module, Component)...
```

> [Learn more about using Polymorph with Lucid](https://github.com/One-Nexus/Lucid/wiki/Module#propsstyleparser)

---

<a href="https://twitter.com/ESR360">
    <img src="http://edmundreed.com/assets/images/twitter.gif?v=1" width="250px" />
</a>
<a href="https://github.com/ESR360">
    <img src="http://edmundreed.com/assets/images/github.gif?v=1" width="250px" />
</a>