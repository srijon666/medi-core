import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Mic,
  Image,
  File,
  Camera,
  MapPin,
  CheckCheck,
  Mail,
  Download,
  Play,
  Pause,
  Square
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  status: "online" | "offline" | "away";
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  attachments?: {
    type: "image" | "file" | "audio" | "location";
    url: string;
    name?: string;
    size?: string;
  }[];
}

const Messages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video">("audio");
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  
  const currentUserId = "user1";
  
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "contact1",
      name: "Dr. Sarah Johnson",
      role: "Neurologist",
      avatar: "/assets/avatars/avatar1.jpg",
      status: "online",
      lastMessage: "Can you share the patient's MRI report?",
      lastMessageTime: "09:32 AM",
      unreadCount: 1,
    },
    {
      id: "contact2",
      name: "Dr. Michael Peters",
      role: "Orthopedic Surgeon",
      avatar: "/assets/avatars/avatar2.jpg",
      status: "online",
      lastMessage: "I'll check on the patient this afternoon",
      lastMessageTime: "Yesterday",
    },
    {
      id: "contact3",
      name: "Nurse Emily Williams",
      role: "Head Nurse",
      avatar: "/assets/avatars/avatar3.jpg",
      status: "away",
      lastMessage: "The patient in room 203 needs attention",
      lastMessageTime: "Yesterday",
      unreadCount: 3,
    },
    {
      id: "contact4",
      name: "Dr. Robert Chen",
      role: "Cardiologist",
      avatar: "/assets/avatars/avatar4.jpg",
      status: "offline",
      lastMessage: "Let's discuss the ECG results tomorrow",
      lastMessageTime: "Tuesday",
    },
    {
      id: "contact5",
      name: "Dr. Patricia Lee",
      role: "Pediatrician",
      status: "online",
      lastMessage: "The vaccination schedule is updated",
      lastMessageTime: "Monday",
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg1",
      senderId: "contact1",
      receiverId: currentUserId,
      text: "Good morning, Dr. Doe. How are you today?",
      timestamp: new Date("2024-05-20T08:30:00"),
      status: "read",
    },
    {
      id: "msg2",
      senderId: currentUserId,
      receiverId: "contact1",
      text: "I'm doing well, thank you. Do you have the lab results for Mr. Thompson?",
      timestamp: new Date("2024-05-20T08:32:00"),
      status: "read",
    },
    {
      id: "msg3",
      senderId: "contact1",
      receiverId: currentUserId,
      text: "Yes, I've just received them. His blood work looks normal, but I'm concerned about his liver function tests.",
      timestamp: new Date("2024-05-20T08:35:00"),
      status: "read",
    },
    {
      id: "msg4",
      senderId: currentUserId,
      receiverId: "contact1",
      text: "Could you send me the results? I'd like to review them.",
      timestamp: new Date("2024-05-20T08:37:00"),
      status: "read",
    },
    {
      id: "msg5",
      senderId: "contact1",
      receiverId: currentUserId,
      text: "Sure, here they are.",
      timestamp: new Date("2024-05-20T08:40:00"),
      status: "read",
      attachments: [
        {
          type: "file",
          url: "#",
          name: "thompson_lab_results.pdf",
          size: "2.4 MB",
        },
      ],
    },
    {
      id: "msg6",
      senderId: currentUserId,
      receiverId: "contact1",
      text: "Thanks, I'll take a look and get back to you.",
      timestamp: new Date("2024-05-20T09:15:00"),
      status: "delivered",
    },
    {
      id: "msg7",
      senderId: "contact1",
      receiverId: currentUserId,
      text: "Can you share the patient's MRI report?",
      timestamp: new Date("2024-05-20T09:32:00"),
      status: "delivered",
    },
  ]);

  const [selectedContactId, setSelectedContactId] = useState<string | null>("contact1");

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = messages.filter(
    msg =>
      (msg.senderId === selectedContactId && msg.receiverId === currentUserId) ||
      (msg.senderId === currentUserId && msg.receiverId === selectedContactId)
  );

  const selectedContact = contacts.find(c => c.id === selectedContactId);

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
    
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.senderId === contactId && msg.receiverId === currentUserId && msg.status !== "read"
          ? { ...msg, status: "read" }
          : msg
      )
    );

    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.id === contactId ? { ...contact, unreadCount: 0 } : contact
      )
    );
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim() || !selectedContactId) return;

    const newMessage: Message = {
      id: `msg${messages.length + 1}`,
      senderId: currentUserId,
      receiverId: selectedContactId,
      text: currentMessage,
      timestamp: new Date(),
      status: "sent",
    };

    setMessages([...messages, newMessage]);
    setCurrentMessage("");

    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.id === selectedContactId
          ? {
              ...contact,
              lastMessage: currentMessage,
              lastMessageTime: "Just now",
            }
          : contact
      )
    );

    setTimeout(() => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 1000);
  };

  const handleInitiateCall = (type: "audio" | "video") => {
    setCallType(type);
    setShowCallDialog(true);
  };

  const handleAttachment = async (type: string) => {
    if (!selectedContactId) return;

    switch (type) {
      case "Photo":
        if (fileInputRef.current) {
          fileInputRef.current.accept = "image/*";
          fileInputRef.current.click();
        }
        break;
      case "Document":
        if (fileInputRef.current) {
          fileInputRef.current.accept = ".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx";
          fileInputRef.current.click();
        }
        break;
      case "Camera":
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" }, 
            audio: false 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          setTimeout(() => {
            if (videoRef.current && context) {
              canvas.width = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
              context.drawImage(videoRef.current, 0, 0);
              
              canvas.toBlob((blob) => {
                if (blob) {
                  const fileName = `camera-${Date.now()}.jpg`;
                  handleBlobUpload(blob, fileName, 'image');
                }
              }, 'image/jpeg', 0.8);
              
              stream.getTracks().forEach(track => track.stop());
            }
          }, 3000);
          
          toast({
            title: "Camera Activated",
            description: "Photo will be captured in 3 seconds...",
          });
          
        } catch (error) {
          toast({
            title: "Camera Error",
            description: "Unable to access camera. Please check permissions.",
            variant: "destructive",
          });
        }
        break;
      case "Location":
        if (navigator.geolocation) {
          toast({
            title: "Getting Location",
            description: "Please wait while we get your location...",
          });
          
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const locationMessage: Message = {
                id: `msg${messages.length + 1}`,
                senderId: currentUserId,
                receiverId: selectedContactId,
                text: `📍 Location shared`,
                timestamp: new Date(),
                status: "sent",
                attachments: [{
                  type: "location",
                  url: `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`,
                  name: `Lat: ${position.coords.latitude.toFixed(6)}, Long: ${position.coords.longitude.toFixed(6)}`
                }]
              };
              setMessages(prev => [...prev, locationMessage]);
              toast({
                title: "Location Shared",
                description: "Your current location has been shared successfully.",
              });
            },
            (error) => {
              toast({
                title: "Location Error",
                description: "Unable to access your location. Please check permissions.",
                variant: "destructive",
              });
            },
            { enableHighAccuracy: true, timeout: 10000 }
          );
        } else {
          toast({
            title: "Location Not Supported",
            description: "Geolocation is not supported by this browser.",
            variant: "destructive",
          });
        }
        break;
    }
    setShowAttachmentOptions(false);
  };

  const handleBlobUpload = (blob: Blob, fileName: string, type: 'image' | 'file') => {
    if (selectedContactId) {
      const fileMessage: Message = {
        id: `msg${messages.length + 1}`,
        senderId: currentUserId,
        receiverId: selectedContactId,
        text: `${type === 'image' ? '📷' : '📄'} ${fileName}`,
        timestamp: new Date(),
        status: "sent",
        attachments: [{
          type: type,
          url: URL.createObjectURL(blob),
          name: fileName,
          size: (blob.size / (1024 * 1024)).toFixed(2) + " MB"
        }]
      };
      setMessages(prev => [...prev, fileMessage]);
      toast({
        title: `${type === 'image' ? 'Photo' : 'Document'} Attached`,
        description: `${fileName} has been shared successfully.`,
      });
    }
  };

  const handleFileUpload = (file: File, type: 'image' | 'file') => {
    if (file && selectedContactId) {
      const fileMessage: Message = {
        id: `msg${messages.length + 1}`,
        senderId: currentUserId,
        receiverId: selectedContactId,
        text: `${type === 'image' ? '📷' : '📄'} ${file.name}`,
        timestamp: new Date(),
        status: "sent",
        attachments: [{
          type: type,
          url: URL.createObjectURL(file),
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
        }]
      };
      setMessages(prev => [...prev, fileMessage]);
      toast({
        title: `${type === 'image' ? 'Photo' : 'Document'} Attached`,
        description: `${file.name} has been shared successfully.`,
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedContactId) {
      const isImage = file.type.startsWith('image/');
      handleFileUpload(file, isImage ? 'image' : 'file');
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (attachment: any) => {
    try {
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: `${attachment.name} is being downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download the file.",
        variant: "destructive",
      });
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const fileName = `voice-message-${Date.now()}.wav`;
        
        if (selectedContactId) {
          const voiceMessage: Message = {
            id: `msg${messages.length + 1}`,
            senderId: currentUserId,
            receiverId: selectedContactId,
            text: `🎵 Voice message (${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')})`,
            timestamp: new Date(),
            status: "sent",
            attachments: [{
              type: "audio",
              url: URL.createObjectURL(audioBlob),
              name: `Voice message ${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}`,
              size: (audioBlob.size / (1024 * 1024)).toFixed(2) + " MB"
            }]
          };
          setMessages(prev => [...prev, voiceMessage]);
        }
        
        stream.getTracks().forEach(track => track.stop());
        setRecordingTime(0);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);

      toast({
        title: "Recording Started",
        description: "Voice message recording in progress...",
      });
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
      
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
      
      toast({
        title: "Recording Completed",
        description: "Voice message has been sent.",
      });
    }
  };

  const handleVoiceMessage = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleStartCall = () => {
    toast({
      title: `${callType === "audio" ? "Audio" : "Video"} Call Initiated`,
      description: `Calling ${selectedContact?.name}...`,
    });
    setShowCallDialog(false);
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />
      
      <video
        ref={videoRef}
        className="hidden"
        autoPlay
        muted
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full md:w-72 lg:w-80 border-r flex flex-col">
          <div className="p-4 border-b bg-white">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map(contact => (
              <div
                key={contact.id}
                className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 ${
                  selectedContactId === contact.id ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSelectContact(contact.id)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                      contact.status === "online"
                        ? "bg-green-500"
                        : contact.status === "away"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">{contact.name}</h3>
                    <span className="text-xs text-gray-500">{contact.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
                </div>
                {contact.unreadCount && contact.unreadCount > 0 ? (
                  <div className="w-5 h-5 bg-hospital-primary rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">{contact.unreadCount}</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {selectedContactId ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <Avatar className="cursor-pointer" onClick={() => setShowContactInfo(!showContactInfo)}>
                  <AvatarImage src={selectedContact?.avatar} />
                  <AvatarFallback>
                    {selectedContact?.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{selectedContact?.name}</h2>
                  <div className="flex items-center text-xs text-gray-500">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                        selectedContact?.status === "online"
                          ? "bg-green-500"
                          : selectedContact?.status === "away"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    ></span>
                    {selectedContact?.status === "online"
                      ? "Online"
                      : selectedContact?.status === "away"
                      ? "Away"
                      : "Offline"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleInitiateCall("audio")}
                  aria-label="Voice call"
                >
                  <Phone className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleInitiateCall("video")}
                  aria-label="Video call"
                >
                  <Video className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="More options">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowContactInfo(!showContactInfo)}>
                      View contact info
                    </DropdownMenuItem>
                    <DropdownMenuItem>Search in conversation</DropdownMenuItem>
                    <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Clear chat</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              <div className="space-y-4">
                {currentMessages.map((message) => {
                  const isCurrentUser = message.senderId === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isCurrentUser
                            ? "bg-hospital-primary text-white rounded-br-none"
                            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border dark:border-gray-700"
                        }`}
                      >
                        {message.text}
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment, index) => (
                              <div key={index}>
                                {attachment.type === "image" ? (
                                  <div className="space-y-2">
                                    <img
                                      src={attachment.url}
                                      alt={attachment.name}
                                      className="max-w-full h-auto rounded-lg max-h-64 object-cover"
                                    />
                                    <Button
                                      size="sm"
                                      variant={isCurrentUser ? "secondary" : "outline"}
                                      onClick={() => handleDownload(attachment)}
                                      className="flex items-center gap-1"
                                    >
                                      <Download className="h-3 w-3" />
                                      Download
                                    </Button>
                                  </div>
                                ) : attachment.type === "location" ? (
                                  <div className={`flex items-center gap-2 p-2 rounded ${
                                    isCurrentUser ? "bg-blue-700" : "bg-gray-100 dark:bg-gray-700"
                                  }`}>
                                    <MapPin className="h-4 w-4" />
                                    <div className="flex-1">
                                      <p className={`text-xs ${isCurrentUser ? "text-white" : "text-gray-800 dark:text-gray-100"}`}>
                                        {attachment.name}
                                      </p>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant={isCurrentUser ? "secondary" : "outline"}
                                      onClick={() => window.open(attachment.url, '_blank')}
                                    >
                                      View Map
                                    </Button>
                                  </div>
                                ) : attachment.type === "audio" ? (
                                  <div className={`flex items-center gap-2 p-2 rounded ${
                                    isCurrentUser ? "bg-blue-700" : "bg-gray-100 dark:bg-gray-700"
                                  }`}>
                                    <Button
                                      size="sm"
                                      variant={isCurrentUser ? "secondary" : "outline"}
                                      onClick={() => {
                                        const audio = new Audio(attachment.url);
                                        audio.play().catch(() => {
                                          toast({
                                            title: "Playback Error",
                                            description: "Unable to play audio file.",
                                            variant: "destructive",
                                          });
                                        });
                                      }}
                                    >
                                      <Play className="h-3 w-3" />
                                    </Button>
                                    <div className="flex-1">
                                      <p className={`text-xs ${isCurrentUser ? "text-white" : "text-gray-800 dark:text-gray-100"}`}>
                                        {attachment.name}
                                      </p>
                                      {attachment.size && (
                                        <p className={`text-xs ${isCurrentUser ? "text-blue-200" : "text-gray-500 dark:text-gray-400"}`}>
                                          {attachment.size}
                                        </p>
                                      )}
                                    </div>
                                    <Button
                                      size="sm"
                                      variant={isCurrentUser ? "secondary" : "outline"}
                                      onClick={() => handleDownload(attachment)}
                                    >
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className={`flex items-center gap-2 p-2 rounded ${
                                    isCurrentUser ? "bg-blue-700" : "bg-gray-100 dark:bg-gray-700"
                                  }`}>
                                    <File className="h-4 w-4" />
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-xs ${isCurrentUser ? "text-white" : "text-gray-800 dark:text-gray-100"} truncate`}>
                                        {attachment.name}
                                      </p>
                                      {attachment.size && (
                                        <p className={`text-xs ${isCurrentUser ? "text-blue-200" : "text-gray-500 dark:text-gray-400"}`}>
                                          {attachment.size}
                                        </p>
                                      )}
                                    </div>
                                    <Button
                                      size="sm"
                                      variant={isCurrentUser ? "secondary" : "outline"}
                                      onClick={() => handleDownload(attachment)}
                                      className="flex items-center gap-1"
                                    >
                                      <Download className="h-3 w-3" />
                                      Download
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className={`text-xs mt-1 flex justify-end items-center gap-1 ${
                          isCurrentUser ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                        }`}>
                          {formatTime(message.timestamp)}
                          {isCurrentUser && (
                            <span>
                              {message.status === "read" ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : message.status === "delivered" ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <CheckCheck className="h-3 w-3 opacity-50" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-3 border-t bg-white dark:bg-gray-800 dark:border-gray-700">
              {isRecording && (
                <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-red-600 dark:text-red-400">
                      Recording: {Math.floor(recordingTime / 60)}:
                      {(recordingTime % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={stopVoiceRecording}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Square className="h-3 w-3" />
                    Stop
                  </Button>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <DropdownMenu open={showAttachmentOptions} onOpenChange={setShowAttachmentOptions}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-lg">
                    <DropdownMenuItem onClick={() => handleAttachment("Photo")}>
                      <Image className="h-4 w-4 mr-2" /> Photo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAttachment("Document")}>
                      <File className="h-4 w-4 mr-2" /> Document
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAttachment("Camera")}>
                      <Camera className="h-4 w-4 mr-2" /> Camera
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAttachment("Location")}>
                      <MapPin className="h-4 w-4 mr-2" /> Location
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Input
                  placeholder="Type a message..."
                  className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`text-gray-500 dark:text-gray-400 ${isRecording ? 'bg-red-100 dark:bg-red-900/20' : ''}`}
                  onClick={handleVoiceMessage}
                >
                  <Mic className={`h-5 w-5 ${isRecording ? 'text-red-500' : ''}`} />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className="bg-hospital-primary hover:bg-hospital-primary/90"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Select a contact to start a conversation
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose from your contacts list on the left
              </p>
            </div>
          </div>
        )}

        {showContactInfo && selectedContact && (
          <div className="hidden md:block w-80 border-l">
            <div className="p-4 border-b">
              <h3 className="font-medium">Contact Info</h3>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => setShowContactInfo(false)}
              >
                ×
              </Button>
            </div>
            <div className="p-4">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-3">
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback className="text-3xl">
                    {selectedContact.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-medium">{selectedContact.name}</h2>
                <p className="text-sm text-gray-500">{selectedContact.role}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">+91 9876543210</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">{selectedContact.name.toLowerCase().replace(" ", ".")}@healthgrid.com</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleInitiateCall("audio")}>
                      <Phone className="h-4 w-4 mr-2" /> Voice Call
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleInitiateCall("video")}>
                      <Video className="h-4 w-4 mr-2" /> Video Call
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {callType === "audio" ? "Audio Call" : "Video Call"}
            </DialogTitle>
            <DialogDescription>
              {callType === "audio" ? "Start an audio call" : "Start a video call"} with {selectedContact?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={selectedContact?.avatar} />
              <AvatarFallback className="text-3xl">
                {selectedContact?.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCallDialog(false)}>
              Cancel
            </Button>
            <Button
              className={callType === "audio" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
              onClick={handleStartCall}
            >
              {callType === "audio" ? (
                <>
                  <Phone className="h-4 w-4 mr-2" /> Start Audio Call
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" /> Start Video Call
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;
