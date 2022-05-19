import cv2, socket, imutils
import time
import base64 

BUFFER_SIZE = 60000
HOST_IP = '127.0.0.1' # adresa loopback ipv4
PORT = 3000
SOCKET_ADDRESS = (HOST_IP, PORT)
IMAGE_WIDTH=350

print(HOST_IP)

# AF -> address family (ipv4), SOCK_DGRAM -> socket type
serverSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) 
# setsockopt -> set socket options 
# SOL_SOCKET -> set those options at socket level
# SO_RCVBUF -> Sets receive buffer size
serverSocket.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, BUFFER_SIZE) 

# assigns an IP address and a port number to a socket instance
serverSocket.bind(SOCKET_ADDRESS) 

print('Server is listening at: ', SOCKET_ADDRESS)

video = cv2.VideoCapture('test.mp4')

fps = 0
startTime = 0
framesAmount = 20 
counter = 0 

while True:
	# receive datagrams from any client on its socket address
	_, clientAddress = serverSocket.recvfrom(BUFFER_SIZE)
	print('Connection from client: ', clientAddress)

	
	# isOpened -> if VideoCapture constructor call succeeded
	while(video.isOpened()):
		# Capture frame by frame
		ret, frame = video.read()

		# frame = imutils.resize(frame, width=IMAGE_WIDTH) # resize bc Buffer is not big enough for camera
		# encodes the frame as jpg in a buffer
		_, buffer = cv2.imencode('.jpg', frame)
		# encode image into text format
		message = base64.b64encode(buffer) 
		
		serverSocket.sendto(message, clientAddress)

		frame = cv2.putText(frame, 'FPS: '+ str(fps), (8, 240), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,0,0), 3)
		cv2.imshow('Video transmis', frame)

		if not ret:
			print('End of the video')
			break
		
		# facem exit cand 'q' is pressed
		if cv2.waitKey(25) & 0xFF == ord('q'): 
			serverSocket.close()
			break

		# we want to know how many frames(20) per second are shown
		if counter == framesAmount:
			try:
				fps = round(framesAmount/(time.time() - startTime))
				startTime=time.time()
				counter=0
			except:
				pass
		
		counter+=1