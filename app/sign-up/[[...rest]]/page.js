import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import Image from "next/image"

export default function SignUpPage() {
return(
  <Box sx={{ width: '100vw', padding: 0, margin: 0 }}>
    <AppBar position="static">
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
    {/* HEADER BUTTONS */}
    <Button style={{ color: 'white' }}>
        <Link href="/login" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
          Login
        </Link>
      </Button>
      <Button style={{ color: 'white' }}>
        <Link href="/sign-up" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
          Sign Up
        </Link>
      </Button>
  </Toolbar>
</AppBar>

<Box
  display="flex"
  flexDirection="column"
  justifyContent="center"
  alignItems="center"
  sx={{textAlign: 'center', my: 4}}
>
  <Typography variant="h4" component="h1" gutterBottom>
    Sign Up
  </Typography>
  <SignUp />
</Box>

</Box>
)}
