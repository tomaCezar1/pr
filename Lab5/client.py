import cv2, socket
import numpy as np
import time
import base64

BUFFER_SIZE = 60000
HOST_IP = '127.0.0.1' # adresa loopback ipv4
PORT = 3000
SOCKET_ADDRESS = (HOST_IP, PORT)
IMAGE_WIDTH=350
print(HOST_IP)

message = b'Test message'

clientSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
clientSocket.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, BUFFER_SIZE)

clientSocket.sendto(message, (HOST_IP, PORT))

fps = 0
startTime = 0
framesAmount = 20 
counter = 0 


while True:
    messagePacket, address = clientSocket.recvfrom(BUFFER_SIZE)

    # decode binary into normal form
    data = base64.b64decode(messagePacket) 
    
    # create an array with the strings, dtype.np.uint8 -> unsigned int 8 bits
    npdata = np.fromstring(data, dtype=np.uint8) 
    
    # read image from a buffer (as an array)
    # here we need to decode the string[] received from server
    frame = cv2.imdecode(npdata, 1) 
    frame = cv2.putText(frame, 'FPS: '+ str(fps), (8, 240), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,0,0), 3)

    # same logic as in server    
    cv2.imshow("Video primit", frame)
    
    if cv2.waitKey(25) & 0xFF == ord('q'):
      clientSocket.close()
      break

    if counter == framesAmount:
      try:
        fps = round(framesAmount / (time.time() - startTime))
        startTime=time.time()
        counter=0
      except:
        pass
    
    counter+=1

