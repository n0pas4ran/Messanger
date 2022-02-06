package main

//sudo electron-packager ./ runit --platform=mas --arch=x64 --electron-version=1.4.3

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"golang.org/x/net/websocket"
)

var (
	dir               string
	clientRequests    = make(chan *NewCLientEvent, 100)
	clientDisconnects = make(chan string, 100)
	messages          = make(chan *Msg, 100)
)

type (
	Msg struct {
		clientKey string
		text      string
	}
	NewCLientEvent struct {
		clientKey string
		msgChan   chan *Msg
	}
)

const MAXBACKLOG = 100

func indexPage(w http.ResponseWriter, r *http.Request, filename string) {
	fp, err := os.Open(dir + "/" + filename)

	if err != nil {
		log.Fatal("No such dir", err)
	}
	_, err = io.Copy(w, fp)

	if err != nil {
		log.Println("Coulnot open filecontents")
	}
	defer fp.Close()
}

func EchoServer(ws *websocket.Conn) {

	var lenBuf = make([]byte, 5)
	msgChan := make(chan *Msg, 100)
	clientKey := ws.RemoteAddr().String()
	clientRequests <- &NewCLientEvent{clientKey, msgChan}
	defer func() { clientDisconnects <- clientKey }()

	go func() {
		for msg := range msgChan {
			ws.Write([]byte(msg.text))
		}
	}()

	for {
		_, err := ws.Read(lenBuf)
		if err != nil {
			log.Println("Error: ", err)
			return
		}
		length, _ := strconv.Atoi(strings.TrimSpace(string(lenBuf)))

		if length > 65536 {
			log.Println("Error: too big length: ", length)
			return
		}
		if length <= 0 {
			log.Println("Error: empty message")
			// return
		}
		var buf = make([]byte, length)
		_, err = ws.Read(buf)
		if err != nil {
			log.Println("Error: could nor read msg")
			return
		}

		messages <- &Msg{clientKey, string(buf)}

	}

}

// func EchoServer_bot(ws *websocket.Conn) {

// 	var lenBuf = make([]byte, 5)
// 	msgChan := make(chan *Msg, 100)
// 	clientKey := ws.RemoteAddr().String()
// 	clientRequests <- &NewCLientEvent{clientKey, msgChan}
// 	defer func() { clientDisconnects <- clientKey }()

// 	go func() {
// 		for msg := range msgChan {
// 			ws.Write([]byte(msg.text))
// 		}
// 	}()

// 	for {
// 		_, err := ws.Read(lenBuf)
// 		if err != nil {
// 			log.Println("Error: ", err)
// 			return
// 		}
// 		length, _ := strconv.Atoi(strings.TrimSpace(string(lenBuf)))

// 		if length > 65536 {
// 			log.Println("Error: too big length: ", length)
// 			return
// 		}
// 		if length <= 0 {
// 			log.Println("Error: empty message")
// 			// return
// 		}
// 		var buf = make([]byte, length)
// 		_, err = ws.Read(buf)
// 		if err != nil {
// 			log.Println("Error: could nor read msg")
// 			return
// 		}

// 		messages <- &Msg{clientKey, string(buf)}

// 	}

// }

func router() {
	clients := make(map[string]chan *Msg)

	for {
		select {
		case req := <-clientRequests:
			clients[req.clientKey] = req.msgChan
			log.Println("Connection client: ", req.clientKey)
		case clientKey := <-clientDisconnects:
			close(clients[clientKey])
			delete(clients, clientKey)
			log.Println("Disconnection client: ", clientKey)
		case msg := <-messages:
			log.Print(msg.clientKey + ": " + msg.text + "\n")
			for _, msgChan := range clients {
				if len(msgChan) < cap(msgChan) {
					msgChan <- msg
				}
			}

		}

	}
}

func main() {
	// dir = os.Args[1]
	dir = "src"
	
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		indexPage(w, r, "index-1.html")
	})	
	http.HandleFunc("/index.js", func(w http.ResponseWriter, r *http.Request) {
		indexPage(w, r, "index.js")
	})
	http.HandleFunc("/bot", func (w http.ResponseWriter, r *http.Request){
		indexPage(w, r, "/bot/bot-page.html")
	})
	http.Handle("/ws", websocket.Handler(EchoServer))


	go router()

	fmt.Println("Server running...")
	http.ListenAndServe(":8080", nil)
}
