import React, {useEffect, useState} from 'react'
import {withFirebase} from './firebase'

import makeStyles from '@material-ui/core/styles/makeStyles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/paper'
import IconButton from '@material-ui/core/IconButton'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined'
import ReportOutlinedIcon from '@material-ui/icons/ReportOutlined';
import Modal from '@material-ui/core/Modal'

import ReportForm from './forms/ReportForm'

import hintService from '../services/hints'

const useStyles = makeStyles(theme => ({
   gridItem: {
      margin: '0.5em 0.5em',
      textAlign: 'center',
      overflowWrap: 'hyphens'
   },
   paper: {
      height: '250px',
      width: '460px'
   },
   cardImage: {
      height: '250px'
   },   
   submissionModal: {
      height: '85%',
      width: '85%',
      margin: 'auto',
   },
   submissionModalPaper: {
      padding: '3em'
   },
}))

const HintCard = withFirebase(({hint, firebase}) => {
   const [votedOn, setVotedOn] = useState({funny: [], helpful: [], report: []})
   const [userAuth, setUserAuth] = useState(null)
   const [openSubmission, setOpenSubmission] = useState(false)
   const classes = useStyles()

   useEffect(() => {
      firebase.auth.onAuthStateChanged(user => {
         user ? setUserAuth(user) : setUserAuth(null)

         hintService
            .getVotes(firebase.auth ? firebase.auth.currentUser.uid : null)
            .then(votes => setVotedOn(votes ? votes : {funny: [], helpful: [], report: []}))
      })   
   }, [])

   const handleOpenSubmission = () => setOpenSubmission(true)
   const handleCloseSubmission = () => setOpenSubmission(false)

   const handleFunnyClick = event => {
      event.preventDefault()
      if (votedOn.funny.find(id => id === hint.id)) {
         hintService
            .update(hint.id, 'notfunny')
            .then(() => {
               hint.funny -= 1
               let arr = votedOn.funny
               votedOn.funny.splice(votedOn.funny.indexOf(hint.id))
               setVotedOn({...votedOn, funny: arr})
            })
      } else {
         hintService
            .update(hint.id, 'funny')
            .then(() => {
               hint.funny += 1
               const arr = votedOn.funny.concat(hint.id)
               setVotedOn({...votedOn, funny: arr})
            })
      }
   }

   const handleHelpfulClick = event => {
      event.preventDefault()
      if (votedOn.helpful.find(id => id === hint.id)) {
         hintService
            .update(hint.id, 'nothelpful')
            .then(() => {
               hint.helpful -= 1
               let arr = votedOn.funny
               votedOn.helpful.splice(votedOn.helpful.indexOf(hint.id))
               setVotedOn({...votedOn, helpful: arr})
            })
      } else {
         hintService
            .update(hint.id, 'helpful')
            .then(() => {
               hint.helpful += 1
               const arr = votedOn.helpful.concat(hint.id)
               setVotedOn({...votedOn, helpful: arr})
            })
      }
   }

   const handleReportClick = event => {
      event.preventDefault()
      if (!votedOn.report.find(id => id === hint.id)) {
         hintService
            .report(hint.id)
            .then(() => {
               const arr = votedOn.report.concat(hint.id)
               setVotedOn({...votedOn, report: arr})
            })
      } 
   }

   return (
      <>
         <Modal
            open = {openSubmission}
            onClose = {handleCloseSubmission}
            onEscapeKeyDown = {handleCloseSubmission}
            onBackdropClick = {handleCloseSubmission}
            className = {classes.submissionModal}
         >
            <Paper className = {classes.submissionModalPaper}>
               <ReportForm hint = {hint} handleCloseSubmission = {handleCloseSubmission}/>
            </Paper>
         </Modal>
         <Paper className = {classes.paper}>
            <Grid container justify = 'flex-start'>
               <Grid item className = {classes.gridItem} style = {{marginTop: '0'}}>
                     <img 
                        src = {`https://lor.mln.cx/Set1/en_us/img/cards/${hint.cardId}.png`}
                        alt = 'cannot load'
                        className = {classes.cardImage}
                     />
               </Grid>
               <Grid item sm = {7} className = {classes.gridItem} style = {{marginLeft: '0', marginRight: '0', position: 'relative'}}>
                  <Grid container direction = 'column' justify = 'space-between' alignItems = 'flex-start'>
                     <Grid item className = {classes.gridItem} style = {{textAlign: 'left', margin: '0'}}>
                        <Typography variant = 'body1' style = {{width: '265px', overflowWrap: 'break-word'}}>
                           {hint.content}
                        </Typography>
                     </Grid>
                     <Grid item className = {classes.gridItem} style = {{position: 'absolute', bottom: '52px', left: '-2px'}}>
                        <Typography variant = 'body2'> - {hint.ownerName}</Typography>
                     </Grid>
                     <Grid item className = {classes.gridItem} style = {{position: 'absolute', bottom: '0px', left: '-5px', marginRight: '0', borderTop: '1px black solid', width: '262px'}}>
                        <div style = {{display: 'inline', marginRight: '85px'}}>
                           <IconButton onClick = {handleFunnyClick}>
                              <InsertEmoticonIcon color = {votedOn.funny.find(id => id === hint.id) ? 'primary' : 'action'}/>
                           </IconButton>
                           <Typography variant = 'button' display = 'inline'>{hint.funny}</Typography>
                           <IconButton onClick = {handleHelpfulClick}>
                              <ThumbUpAltOutlinedIcon color = {votedOn.helpful.find(id => id === hint.id) ? 'primary' : 'action'}/>
                           </IconButton>
                           <Typography variant = 'button' display = 'inline'>{hint.helpful}</Typography>
                        </div>
                        <div style = {{display: 'inline', marginLeft: '-5px'}}>
                           <IconButton onClick = {handleOpenSubmission}>
                              <ReportOutlinedIcon color = 'error'/>
                           </IconButton>
                        </div>
                     </Grid>
                  </Grid>
               </Grid>
            </Grid>
         </Paper>
      </>
   )
})

export default HintCard