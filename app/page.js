'use client'

import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Button, Container, Typography, Toolbar, Box, Grid } from "@mui/material";
import Head from "next/head";
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'


export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: {
        origin: 'https://localhost:3000',
      },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })

    if (error){
      console.warn(error.message)
    }
  }
  return (
<Box sx={{ width: '100vw', padding: 0, margin: 0 }}>
  <Head>
    <title>Flashcard SaaS</title>
    <meta name = "description" content='Create flashcards from your text'/>
  </Head>

<AppBar position = "static">
  <Toolbar>
  <Typography variant='h6' style={{ flexGrow: 1 }}>
      <Link href="/" passHref>
        <Image
          src='/logo.png'
          alt="Flashcard SaaS Logo"
          width={70} // Adjust width as needed
          height={100} // Adjust height as needed
          layout="intrinsic" // Maintain aspect ratio
          style={{ cursor: 'pointer' }}
        />
      </Link>
    </Typography>
    <SignedOut>
      <Button color="inherit" href='/login'> Login</Button>
      <Button color="inherit" href='/sign-up'>Sign Up</Button>
    </SignedOut>
    <SignedIn>
      <UserButton/>
    </SignedIn>
  </Toolbar>
</AppBar>
{/* Main Content Wrapper with Padding */}
<Box sx={{ padding: 4 }}> {/* Add left and right padding here */}
{/* Hero Section */}
    <Box sx={{textAlign:'center', my: 4,}}>
      <Typography variant="h2" gutterBottom>Welcome to Flashcard SaaS</Typography>
      <Typography variant="h5" gutterBottom sx={{ fontStyle: 'italic' }}>{''}The easiest way to make flashcards from your text</Typography>
      <Button variant='contained' sx={{mt: 2, backgroundColor: '#9370DB', padding: '12px 24px', fontSize: '16px'}}>
        <Link href="/generate" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
          Get Started
        </Link>
      </Button>
    </Box>
{/* Features Section */}
<Box sx={{my:6, textAlign: 'center' }}>
  <Typography variant='h4' gutterBottom> Features </Typography>
  <Grid container spacing ={4}>
    {/* GRID ITEM 1 */}
    <Grid item xs={12} md={4} sx={{ paddingLeft: 2 }}>
      <Typography variant='h6' gutterBottom sx={{fontWeight: 'bold' }}>
      Quick Flashcard Setup
      </Typography>
      <Typography> {''} Create flashcards instantly by entering text or importing files.</Typography>
    </Grid>
    {/* GRID ITEM 2 */}
    <Grid item xs={12} md={4} sx={{ paddingLeft: 2 }}>
      <Typography variant='h6' gutterBottom sx={{fontWeight: 'bold' }}>
      Web-Optimized Design
      </Typography>
      <Typography> {''} Access your flashcards seamlessly on any browser. </Typography>
    </Grid>
    {/* GRID ITEM 3 */}
    <Grid item xs={12} md={4} sx={{ paddingLeft: 2 }}>
      <Typography variant='h6' gutterBottom sx={{fontWeight: 'bold' }}>
      Simple Review
      </Typography>
      <Typography> {''} View and study your flashcards effortlessly. </Typography>
    </Grid>
  </Grid>

{/* PRICING SECTION */}
  <Box sx={{my: 6, textAlign: 'center' }}>
    <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
    <Grid container spacing={4} justifyContent="center">
    {/* GRID ITEM 1 */}
    <Grid item xs={12} md={6} sx={{ paddingLeft: 2 }}>
      <Box sx={{
        p:3,
        border:'1px solid',
        borderColor: 'grey.300',
        borderRadius: 2,
      }}>
        <Typography variant='h5' gutterBottom sx={{fontWeight: 'bold' }}> Basic </Typography>
        <Typography variant='h6' gutterBottom> $5 / month </Typography>
        <Typography> {''} Access to basic flashcard features and limited storage.</Typography>
        <Button variant='contained' color="primary" sx={{mt: 2}}> Choose Basic</Button>
      </Box>
    </Grid>
    {/* GRID ITEM 2 */}
    <Grid item xs={12} md={6} sx={{ paddingLeft: 2 }}>
    <Box sx={{
        p:3,
        border:'1px solid',
        borderColor: 'grey.300',
        borderRadius: 2,
      }}>
        <Typography variant='h5' gutterBottom sx={{fontWeight: 'bold' }}> Pro </Typography>
        <Typography variant='h6' gutterBottom> $10 / month </Typography>
        <Typography> {''} Unlimited flashcard features and storage with priority support.</Typography>
        <Button variant='contained' color="primary" sx={{mt: 2}} onClick={handleSubmit}> Choose Pro</Button>
      </Box>
    </Grid>
    </Grid>
  </Box>


</Box>
  </Box>
  </Box>
  );
}
