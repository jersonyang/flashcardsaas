'use client'
import { useUser, SignedIn } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import Link from 'next/link'

import { getDocs, doc, collection, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'

import { useSearchParams } from 'next/navigation'
import { Container, TextField, Button, Typography, Box, Paper, Grid, Card, CardContent, CardActionArea, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions } from '@mui/material'

export default function Flashcard() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])

    const searchParams=useSearchParams()
    const search = searchParams.get('id')
  
    useEffect(() => {
        async function getFlashcard() {
          if (!search || !user) return

          const colRef = collection(doc(collection(db, 'users'), user.id), search)
          const docs = await getDocs(colRef)
          const flashcards = []    

        docs.forEach((doc)=>{
            flashcards.push({id: doc.id, ...doc.data()})
        })
        setFlashcards(flashcards)
    }
        getFlashcard()
      }, [user, search])

      const handleCardClick = (id) => {
        setFlipped((prev) => ({
          ...prev,
          [id]: !prev[id],
        }))
      }
      
      if (!isLoaded || !isSignedIn) {
        return <></>
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
            <Typography variant="h4"> 
            {search ? `${search} Flashcards` : 'Flashcards'}
            </Typography>
            <Box
              display="flex"
              justifyContent="flex-end"
              gap={1}
              >
              <Button variant="contained" sx={{ backgroundColor: "#4682b4" }}>
                <Link href="/flashcards" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                  Saved Flashcards
                </Link>
              </Button>
                <Button variant="contained" sx={{ backgroundColor: "#daa520" }}>
                <Link href="/generate" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                  Generate
                </Link>
              </Button>
            </Box>
          </Box>
      {/* Flashcards Section */}
        <Grid container spacing={3} sx={{ mt: 2 }}> 
        {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>                
                <CardActionArea onClick={()=>{
                  handleCardClick(index)
                }}>
                
                  <CardContent>
                    <Box sx={{perspective: '1000px', 
                    '& > div': {
                      transition: 'transform 0.6s',
                      transformStyle: 'preserve-3d',
                      position: 'relative',
                      width: '100%',
                      height: '200px',
                      boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                      transform: flipped[index]
                      ? 'rotateY(180deg)' 
                      :'rotateY(0deg)',
                    },
                    '& > div > div': {
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 2,
                      boxSizing: 'border-box',
                    },
                    '& > div > div:nth-of-type(2)': {
                      transform: 'rotateY(180deg)'
                    },
                      }}>
                      <div>
                        <div>
                          <Typography variant="h6" component='div'></Typography>
                          <Typography>{flashcard.front}</Typography>
                          </div>
                          <div>
                          <Typography variant="h6"  component='div' sx={{ mt: 2 }}></Typography>
                          <Typography>{flashcard.back}</Typography>
                      </div>
                        </div>
                    </Box>
                  </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
    </Grid> 
    </Container>

      )
      
    }
  