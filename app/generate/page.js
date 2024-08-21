'use client'
import { useState } from 'react'
import { Container, TextField, Button, Typography, Box, Paper, Grid, Card, CardContent, CardActionArea, Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions } from '@mui/material'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { writeBatch, doc, collection, getDoc, getFirestore} from 'firebase/firestore'
import db from '@/firebase'
import OpenAI from 'openai'
import Link from 'next/link'

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter() // Corrected

  const handleSubmit = async () => {
    fetch('api/generate', { // Corrected path
      method: 'POST',
      body: text, // Added JSON.stringify
      // headers: { 'Content-Type': 'application/json' } // Added headers
    })
      .then((res) => res.json())
      .then(data => setFlashcards(data)) // Corrected arrow function syntax
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleOpen = () => {
    setOpen(true) // Corrected
  }

  const handleClose = () => {
    setOpen(false) // Corrected
  }

  const saveFlashCards = async () => {
    if (!name) {
      alert('Please enter a name')
      return
    }

    const db = getFirestore();
    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, 'users'), user.id) 
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || []
      if (collections.find((f) => f.name === name)) {
        alert('Flashcard collection with the same name already exists.')
        return
      } else {
        collections.push({ name })
        batch.set(userDocRef, { flashcards: collections }, { merge: true })
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] })
    }

    const colRef = collection(userDocRef, name)
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef)
      batch.set(cardDocRef, flashcard)
    })

    await batch.commit()
    handleClose()
    router.push('/flashcards')
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
        <Typography variant="h4" gutterBottom>
          Generate Flashcards
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
                <Button variant="contained" sx={{ backgroundColor: "#9370DB" }}>
                <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                  Home
                </Link>
              </Button>
         </Box>
        </Box>
        <Paper sx={{ p: 4, width: '100%' }}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            {' '}
            Submit
          </Button>
        </Paper>
      </Box>
      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Generated Flashcards
          </Typography>
          <Grid container spacing={2}>
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
          <Box sx={{mt: 4, mb: 4, display: 'flex', justifyContent: 'center'}}>
              <Button variant='contained' color='primary' onClick={handleOpen} >
                Save
              </Button>
          </Box>
        </Box>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
        <DialogContentText>
          Please enter a name for your flashcards collection. 
        </DialogContentText>
        <TextField
        autoFocus 
        margin='dense' 
        label='Collection Name' 
        type='text' 
        fullWidth 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        variant = 'outlined'
        />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashCards}>Save</Button>
        </DialogActions>
      </Dialog>

    </Container>
  )
}