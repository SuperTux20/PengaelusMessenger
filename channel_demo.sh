#!/bin/bash

wait() {
	echo
	echo
	sleep 1
}

echo "Creating channel announcements"
curl -X POST -H "Content-Type: application/json" -d '{"name": "announcements"}' "localhost:3000/channels"
wait
echo "Creating channel general"
curl -X POST -H "Content-Type: application/json" -d '{"name": "general"}' "localhost:3000/channels"
wait
echo "Getting all channels"
curl -X GET "localhost:3000/channels"
wait
echo "Sending message in channel 0 as SuperTux20"
curl -X POST -H "Content-Type: application/json" -d '{"author": "SuperTux20", "message": "The server is now open!"}' "localhost:3000/channels?cid=0"
wait
echo "Sending message in channel 1 as SuperTux20"
curl -X POST -H "Content-Type: application/json" -d '{"author": "SuperTux20", "message": "Howdy fellas!"}' "localhost:3000/channels?cid=1"
wait
echo "Sending message in channel 1 as SammyGun"
curl -X POST -H "Content-Type: application/json" -d '{"author": "SammyGun", "message": "Ayy, sup?"}' "localhost:3000/channels?cid=1"
wait
echo "Sending message in channel 1 as AlTheInventor"
curl -X POST -H "Content-Type: application/json" -d '{"author": "AlTheInventor", "message": "yooooooooo"}' "localhost:3000/channels?cid=1"
wait
echo "Getting channel 1"
curl -X GET "localhost:3000/channels?cid=1"
wait
echo "Getting message 2 in channel 1"
curl -X GET "localhost:3000/channels?cid=1&mid=2"
wait
echo "Editing message 2 in channel 1"
curl -X PATCH -H "Content-Type: application/json" -d '{"message": "Yo"}' "localhost:3000/channels?cid=1&mid=2"
wait

for i in {0..2}; do
	echo "Deleting message 0 in channel 1"
	curl -X DELETE "localhost:3000/channels?cid=1&mid=0"
	wait
done
