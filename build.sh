ng build --prod --aot
cd ./toexe
rm -R .app/* &
mv ./../dist/fec* ./app/
go run main.go
cd ../server
go build
rm app.go &
rm -R ../toexe/app* &
./server

