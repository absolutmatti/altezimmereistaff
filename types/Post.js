// types/Post.js

export const PostTypes = {
    NEWS: 'news',
    GENERAL: 'general'
  };
  
  // Diese Struktur repräsentiert einen Benutzer/Autor
  export const Author = {
    id: String,
    name: String,
    profileImage: String,
    role: String
  };
  
  // Basisstruktur für alle Posts
  export const BasePost = {
    id: String,
    content: String,
    author: Object, // Autor-Objekt
    createdAt: String, // ISO-Datumsstring
    updatedAt: String, // ISO-Datumsstring
    categories: Array, // Array von Strings
    commentCount: Number,
    mediaUrl: String // optional
  };
  
  // Struktur für einen Nachrichtenpost
  export const NewsPost = {
    ...BasePost,
    title: String,
    important: Boolean,
    pinned: Boolean,
    hasVoting: Boolean
  };
  
  // Struktur für einen allgemeinen Post
  export const GeneralPost = {
    ...BasePost,
    reactions: Object // Objekt mit Emoji als Schlüssel und Anzahl als Wert
  };