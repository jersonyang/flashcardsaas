'use client'
import { useUser } from '@clerk/nextjs'
import { use, useEffect, useState } from 'react'

import { CollectionReference, collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useRouter } from 'next/navigation'
import { Router } from 'next/router'
import { Container, TextField, Button, Typography, Box, Paper, Grid, Card, CardContent, CardActionArea, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions } from '@mui/material'
import Link from 'next/link'

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()
  
    useEffect(() => {
        async function getFlashcards() {
        if (!user) return
        const docRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()){
            const collections = docSnap.data().flashcards || []
            setFlashcards(collections)
        } else{
            await setDoc(docRef, {flashcards: []})
        }
    }
    getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn){
        return <></>
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
    }

    return (
        <Container maxWidth="md">
        {/* Header Section */}
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            pt={4} 
          >
        <Typography variant="h4">Saved Flashcards</Typography>
        <Box
              display="flex"
              justifyContent="flex-end"
              gap={1}
              >
                <Button variant="contained" sx={{ backgroundColor: "#daa520" }}>
                <Link href="/generate" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                  Generate
                </Link>
              </Button>
              <Button variant="contained" sx={{ backgroundColor: "#9370DB" }}>
                <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                  Home
                </Link>
              </Button>
            </Box>
        </Box>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {flashcard.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )
       }