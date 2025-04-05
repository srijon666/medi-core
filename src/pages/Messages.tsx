
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
  Mail
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

// Contact interface
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

// Message interface
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
  
  // Mock user ID - in a real app, this would come from auth context
  const currentUserId = "user1";
  
  // Mock contacts
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

  // Mock messages
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

  // Current selected contact
  const [selectedContactId, setSelectedContactId] = useState<string | null>("contact1");

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current messages
  const currentMessages = messages.filter(
    msg =>
      (msg.senderId === selectedContactId && msg.receiverId === currentUserId) ||
      (msg.senderId === currentUserId && msg.receiverId === selectedContactId)
  );

  // Get selected contact
  const selectedContact = contacts.find(c => c.id === selectedContactId);

  // Handle selecting a contact
  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
    
    // Mark messages as read
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.senderId === contactId && msg.receiverId === currentUserId && msg.status !== "read"
          ? { ...msg, status: "read" }
          : msg
      )
    );

    // Clear unread count
    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.id === contactId ? { ...contact, unreadCount: 0 } : contact
      )
    );
  };

  // Handle send message
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

    // Update last message in contacts
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

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 1000);
  };

  // Handle initiating a call
  const handleInitiateCall = (type: "audio" | "video") => {
    setCallType(type);
    setShowCallDialog(true);
  };

  // Handle attachment selection
  const handleAttachment = (type: string) => {
    toast({
      title: "Attachment Feature",
      description: `${type} attachment selected. This feature is in development.`,
    });
    setShowAttachmentOptions(false);
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Functions for call handling
  const handleStartCall = () => {
    toast({
      title: `${callType === "audio" ? "Audio" : "Video"} Call Initiated`,
      description: `Calling ${selectedContact?.name}...`,
    });
    setShowCallDialog(false);
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Contacts Sidebar */}
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

        {/* Chat Area */}
        {selectedContactId ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
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

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
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
                            : "bg-white text-gray-800 rounded-bl-none border"
                        }`}
                      >
                        {message.text}
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2">
                            {message.attachments.map((attachment, index) => (
                              <div
                                key={index}
                                className={`flex items-center gap-2 p-2 rounded ${
                                  isCurrentUser ? "bg-blue-700" : "bg-gray-100"
                                }`}
                              >
                                <File className="h-4 w-4" />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs ${isCurrentUser ? "text-white" : "text-gray-800"} truncate`}>
                                    {attachment.name}
                                  </p>
                                  {attachment.size && (
                                    <p className={`text-xs ${isCurrentUser ? "text-blue-200" : "text-gray-500"}`}>
                                      {attachment.size}
                                    </p>
                                  )}
                                </div>
                                <button
                                  className={`text-xs ${isCurrentUser ? "text-white bg-blue-800" : "text-blue-600 bg-white"} px-2 py-1 rounded`}
                                  onClick={() => toast({ title: "Download", description: "Download started" })}
                                >
                                  Download
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className={`text-xs mt-1 flex justify-end items-center gap-1 ${
                          isCurrentUser ? "text-blue-100" : "text-gray-500"
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

            {/* Input Area */}
            <div className="p-3 border-t bg-white">
              <div className="flex items-center gap-2">
                <DropdownMenu open={showAttachmentOptions} onOpenChange={setShowAttachmentOptions}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-500">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
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
                  className="flex-1"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim()}
                  className="bg-hospital-primary"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700">
                Select a contact to start a conversation
              </h3>
              <p className="text-gray-500">
                Choose from your contacts list on the left
              </p>
            </div>
          </div>
        )}

        {/* Contact Info Sidebar */}
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
                      <span className="text-sm">{selectedContact.name.toLowerCase().replace(" ", ".")}@medicore.com</span>
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

      {/* Call Dialog */}
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
