// Accordian
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
	},
	heading: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightRegular,
	},
}))

const Accordiancomp = ({ drizzle, drizzleState, initialized }) => {
	const classes = useStyles()

	const [publishedBookList, setPublishedBookList] = useState([])
	const [open, setOpen] = useState(false)

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	}

	const getPastEvents = async (event, options) => {
		const web3 = drizzle.web3
		const EBContract = drizzle.contracts.EBookStorage
		const EBContractWeb3 = new web3.eth.Contract(EBContract.abi, EBContract.address)

		// console.log('[DEBUG] EBContractWeb3: ', EBContractWeb3)

		return await EBContractWeb3.getPastEvents(event, options)
	}

	const setupPublishedBookListing = async () => {
		const events = await getPastEvents('publishedBookEvent', {
			filter: { _client: drizzleState.accounts[0] },
			fromBlock: 0,
			toBLock: 'latest',
		})
		// console.log('[DEBUG] events: ', events)

		let newEBookList = []

		events.forEach(log => {
			// console.log('[DEBUG] log: ', log)
			const author = log.returnValues[0]
			const ipfsHash = log.returnValues[1]
			const title = log.returnValues[2]
			const price = log.returnValues[3]

			const ebook = {
				author,
				ipfsHash,
				title,
				price,
			}

			newEBookList.push(ebook)
		})

		setPublishedBookList(newEBookList)
	}

	useEffect(() => {
		if (initialized) {
			setupPublishedBookListing()
		}
	}, [initialized])

	if (!initialized) {
		return 'Loading...'
	}

	return (
		<div className={classes.root}>
			{publishedBookList.map(ebook => {
				return (
					<Accordion key={ebook.ipfsHash}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls='panel1a-content'
							id='panel1a-header'>
							<Typography className={classes.heading}>
								<strong>{ebook.title}</strong>
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography variant='body1' gutterBottom>
								<p>
									<strong>Author: </strong>
									{ebook.author}
								</p>
								<p>
									<span>
										<strong>Price: </strong>
									</span>
									<span>{ebook.price}</span>
								</p>
							</Typography>
						</AccordionDetails>
					</Accordion>
				)
			})}
		</div>
	)
}

export const Accordiancomp2 = ({ drizzle, drizzleState, initialized }) => {
	const classes = useStyles()

	const [purchasedBookList, setPurchasedBookList] = useState([])
	const [open, setOpen] = useState(false)

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}

		setOpen(false)
	}

	const getPastEvents = async (event, options) => {
		const web3 = drizzle.web3
		const EBContract = drizzle.contracts.EBookStorage
		const EBContractWeb3 = new web3.eth.Contract(EBContract.abi, EBContract.address)

		// console.log('[DEBUG] EBContractWeb3: ', EBContractWeb3)

		return await EBContractWeb3.getPastEvents(event, options)
	}

	const setupPurchasedBookListing = async () => {
		const events = await getPastEvents('purchasedBookEvent', {
			filter: { _client: drizzleState.accounts[0] },
			fromBlock: 0,
			toBLock: 'latest',
		})
		// console.log('[DEBUG] events: ', events)

		let newEBookList = []

		events.forEach(async log => {
			// console.log('[DEBUG] log: ', log)
			const author = log.returnValues[0]
			const client = log.returnValues[1]
			const ipfsHash = log.returnValues[2]
			const price = log.returnValues[3]

			const title = await drizzle.contracts.EBookStorage.methods
				.sourceToTitle(ipfsHash)
				.call({ from: drizzleState.accounts[0] })

			const ebook = {
				author,
				ipfsHash,
				title,
				price,
			}

			newEBookList.push(ebook)
		})

		setPurchasedBookList(newEBookList)
	}

	useEffect(() => {
		if (initialized) {
			setupPurchasedBookListing()
		}
	}, [initialized])

	if (!initialized) {
		return 'Loading...'
	}

	return (
		<div className={classes.root}>
			{purchasedBookList.map(ebook => {
				return (
					<Accordion key={ebook.ipfsHash}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls='panel1a-content'
							id='panel1a-header'>
							<Typography className={classes.heading}>
								<strong>{ebook.title}</strong>
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography variant='body1' gutterBottom>
								<p>
									<strong>Author: </strong>
									{ebook.author}
								</p>
								<p>
									<span>
										<strong>Price: </strong>
									</span>
									<span>{ebook.price}</span>
								</p>
							</Typography>
						</AccordionDetails>
					</Accordion>
				)
			})}
		</div>
	)
}

export default Accordiancomp