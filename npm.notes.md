## Notes on package.json

### creating a new package.json file:
To create a new package.json file, you can copy/paste from another project, or
you can type it by hand, or...

...you can run the following command at the terminal prompt:

```
npm init
```

This will prompt you for values to add to the package.json file. If you want to
accept the default answers to the prompts, you can add "-y" to the request:

```
npm init -y
```

Note that if you run "npm init" in a project folder that already has a
package.json file, npm will simply download all of the dependencies for the
project (see below).

### installing node packages / dependencies
NPM will manage your project using data in package.json.

To install a package, use "npm install" :

```
npm install <package_name>
```

If the package is a _utility_, rather than a _library_, you may wish to install
it "globally", so it's available anywhere in your system, and you can run it for
any project. An example is the "gitignore" utility, which downloads a .gitignore
file from github, specifically for your development language and environment
(like Node.js).

#### installing packages globally or locally
To install a package globally, use the "-g" option:

```
npm install gitignore -g
```

If you don't install it globally, you won't be able to run it from the command
prompt. 

Packages that are not installed globally are installed in the node_modules
folder of your project. Note that node_modules is in the .gitignore file for
Node projects, so these packages are never checked into your git repo. When
someone downloads your code, they can "initialize" the project by running "npm
init" (if package.json already exists, "npm init" won't prompt for values or
create a new package.json... rather, it will download all of the package
dependencies.)

#### using npx to run npm utility packages without installing them
If you need to run a utility from the command prompt, but you don't want to
install it globally, you can use the "npx" utility. Both npm and npx are
installed with Node.js.

```
npx gitignore node
```

This will download enough of the package to run it, execute the command, and
remove anything it downloaded (that isn't needed by other packages/projects).

#### production dependencies and dev dependencies
When  you install packages, they may be required for your application to run in
production. But there are sometimes packages (libraries and utilities) that are
only useful in dev/test environments, and that you would never want to deploy to
production.

To install a package as a "dev dependency" (which will prevent npm from
deploying it to production), use the "-D" option:

```
npm install nodemon -D
```

### scripts
The package.json file has a "scripts" property. The value of this property is an
object with properties that correspond to "scripts" - commands that can be run
by npm without having to type them over and over.

For example, you can create a "start" command that will start your application
running in Node. You can create a "server" command that will start your
application using nodemon, if you want. You can create a "test" command that
will kick off a collection of tests against your code. There are many, many more
commands you may want to create as scripts, related to deploying and configuring
the application.

Because these are defined in package.json, which is included with your code,
anyone who downloads your code will have access to these scripts. Special
commands or operations needed to launch the app, or run tests, etc., will be
automatically included, without them needing to type them in, etc. That way,
typos are not a problem, and everyone has a consistent dev environment.