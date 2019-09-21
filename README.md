# Echannelling

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

ng build --prod --aot <br>
cd ./toexe <br>
rm -R .app/* & <br>
mv ./../dist/fec* ./app/ <br>
go run main.go <br>
cd ../server <br>
change unique device id in server.go<br>
go build <br>
move server.exe to NW.js folder <br>

cd backend <br>
nexe doctors.js <br>
move backend.exe and node_modules to NW.js folder <br>

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
