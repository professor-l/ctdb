# Resources

This document links to several helpful resources for learning more about the various tools, frameworks, and libraries we take advantage of in this codebase.

### Git

`git` ([homepage](https://git-scm.com/) and [documentation](https://git-scm.com/docs)) is a [version control system](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control) (that's a great write-up on what a VSC is from the git folks). It was developed  to provide version control for the [Linux kernel](https://github.com/torvalds/linux) in 2005 when their existing (proprietary) system proved more trouble than it was worth.

Besides learning about version control, if you have lots of free time, the entire [git book](https://git-scm.com/book/en/v2) is a fantastic in-depth resource on the tool. Otherwise, the first two chapters, [Getting Started](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control) and [Git Basics](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository), will give you a solid overview of what you'll need to begin contributing here.

### Node.js

Node.js ([homepage](https://nodejs.org) and [documentation](https://nodejs.org/api/)) is a server-side JavaScript runtime for backend web development. It is what allows us to write JavaScript (or TypeScript in our case) for our server-side code.

### TypeScript

TypeScript ([homepage](https://www.typescriptlang.org/) and [documentation](https://www.typescriptlang.org/docs/)) is a language with JavaScript syntax (that even transpiles to JS) but adds support for **strong typing**, meaning we can specify the types of variables the way one might in Java, rather than relying on dynamic runtime typing the way traditional JavaScript, Python, or Ruby work. If you've never worked with TypeScript before, they have resources for [new programmers](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html), [Java/C# developers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html), and [JavaScript developers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).

### GraphQL

GraphQL ([homepage](https://graphql.org/) and [specification](https://spec.graphql.org/October2021/)) stands for "graph query language", and it's designed to be an alternate API query language/runtime that can serve some needs more efficiently than a traditional [REST API](https://restfulapi.net/). In other words, it provides a mechanism for applications to communicate with our database. For an overview of GraphQL, [this website](https://www.howtographql.com/basics/0-introduction/) has a great outline of what it is and how it works - just the fundamentals section is quite informative.

### Prisma

Prisma ([homepage](https://www.prisma.io/) and [documentation](https://www.prisma.io/docs/)) is an ([ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) (object-relational mapper) for Node.js and TypeScript designed to fit seamlessly into a GraphQL workflow. Prisma is what we use to talk to our database using clear and concise syntax rather than with inline [SQL](https://en.wikipedia.org/wiki/SQL). The basics of Prisma CRUD queries can be found [here](https://www.prisma.io/docs/concepts/components/prisma-client/crud) in the documentation.

## A note to developers

I'll try to keep this document updated with more links as I add tools to this project, and I encourage other developers to do the same! Codebase accessibility is the best way to ensure longevity of a project, and that starts with documentation.