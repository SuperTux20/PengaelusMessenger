#!/bin/bash

wait() {
	echo
	echo
	sleep 1
}

echo "Creating user bob"
curl -X POST -H "Content-Type: application/json" -d '{"username": "bob", "password": "password"}' "localhost:3000/users"
wait
echo "Creating user al"
curl -X POST -H "Content-Type: application/json" -d '{"username": "al", "password": "qwerty"}' "localhost:3000/users"
wait
echo "Creating user beefmaster"
curl -X POST -H "Content-Type: application/json" -d '{"username": "beefmaster", "password": "burger"}' "localhost:3000/users"
wait
echo "Creating user pablo"
curl -X POST -H "Content-Type: application/json" -d '{"username": "pablo", "password": "bottle"}' "localhost:3000/users"
wait
echo "Getting all users"
curl -X GET "localhost:3000/users"
wait
echo "Getting user 3"
curl -X GET "localhost:3000/users?uid=3"
wait
echo "Changing user 3's password"
curl -X PATCH -H "Content-Type: application/json" -d '{"password": "bottlecap"}' "localhost:3000/users?uid=3"
wait
for i in {0..3}; do
	echo "Deleting user 0"
	curl -X DELETE "localhost:3000/users?uid=0"
	wait
done
