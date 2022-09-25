import React, { useEffect, useState } from 'react'
import { addDoc, collection, getDocs } from 'firebase/firestore'
import db from '../lib/init-firebase'
import './Dropdown.css';

const Dropdown = () => {
    const [TestData, setTestData] = useState([])

    const [listItems, setListItems] = useState([])

    const [showInfo, setShowInfo] = useState("none")

    const [filterdata, setFilterData] = useState('')

    const [displayModal, setDisplayModal] = useState("none")

    const [isFetching, setIsFetching] = useState(false);



    // Scroller listener
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // if it reaches below, it triggers the use effect below, which observes isFetching
    function handleScroll() {
        if (
            window.innerHeight + document.documentElement.scrollTop !==
            document.documentElement.offsetHeight
        )
            return;
        setIsFetching(true);
    }
    // -----------------

    // data initiator
    useEffect(() => {
        getTestData()
    }, [])
    // fetch ALL data and put it in test data
    function getTestData() {
        console.log("lengs test y list:", TestData.length, listItems.length)
        setTestData([])
        setListItems([])
        const TestDataCollectionRef = collection(db, 'TestData')
        getDocs(TestDataCollectionRef)
            .then(response => {

                const data = response && response.docs.map(elm => ({
                    Name: elm._document.data.value.mapValue.fields.Name.stringValue,
                    SocialReason: elm._document.data.value.mapValue.fields.SocialReason.stringValue,
                    CellNumber: elm._document.data.value.mapValue.fields.CellNumber.integerValue,
                    Code: elm._document.data.value.mapValue.fields.Code.integerValue,
                    NIT: elm._document.data.value.mapValue.fields.NIT.integerValue
                }))
                setTestData(data)
                console.log("llegando:", TestData)
            })
            .catch(error => console.log(error.message))
    }

        // every time there is a change in test data, it will load 20 more in list items
    useEffect(() => { 
        if (TestData && TestData.length !== 0 && TestData.length !== listItems.length && listItems.length === 0)
        for (let i = 0; i < 20; i++) {
            if (TestData[i] !== undefined) {
                setListItems((prevState) => [
                    ...prevState,

                    TestData[i]
                ])
            }
        }
    }, [TestData]);
    // ---------


    // fetchers
    useEffect(() => {
        if (!isFetching) return;
        fetchMoreListItems();
    }, [isFetching]);

// if the Scroller listener triggers it, send 20 testdata objects to listitems
    function fetchMoreListItems() {
        if (TestData.length !== listItems.length) {
            setTimeout(() => {
                for (let i = listItems.length; i < listItems.length + 20; i++) {
                    if (TestData[i] !== undefined) {
                        setListItems((prevState) => [
                            ...prevState,

                            TestData[i]
                        ])
                    }

                }
                setIsFetching(false);
            }, 2000);
        }
    }
    // ----------------

    // filters
    // activated by handlesubmit, see what argument is passed, if empty, run showemptyfunction, if not, showfullfunction
    const Search = (arg) => {
        arg === "" || filterdata === '' ? showEmptyFunction() : showFullFunction(arg);
    };

    // reload all items or show hidden items for the collapsible
    const showEmptyFunction = function () {
        if (
            showInfo === "block"
        ) {
            setShowInfo("none")
            getTestData()
            setIsFetching(false);
        }
        else {
            setShowInfo("block")
            getTestData()

        }
    }

// using handleOnChange and the handleOnSubmit argument maps and includes on each value depending on the category given by handleOnChange
    const showFullFunction = function (arg) {
        if (showInfo === "none") {
            setShowInfo("block")
        }
        const TestDataCollectionRef = collection(db, 'TestData')
        if (arg === "") { alert("hola") }
        getDocs(TestDataCollectionRef)
            .then(response => {
                const data = response && response.docs.filter(e =>
                    filterdata !== undefined && filterdata === "Name" ? e._document.data.value.mapValue.fields.Name.stringValue.toLowerCase().includes(arg.toLowerCase()) :
                        filterdata === "Code" ? e._document.data.value.mapValue.fields.Code.integerValue.includes(arg) :
                            filterdata === "CellNumber" ? e._document.data.value.mapValue.fields.CellNumber.integerValue.includes(arg) :
                                filterdata === "NIT" ? e._document.data.value.mapValue.fields.NIT.integerValue.includes(arg) :
                                    filterdata === "SocialReason" ? e._document.data.value.mapValue.fields.SocialReason.stringValue.toLowerCase().includes(arg.toLowerCase()) :
                                        ""
                ).map(elm => ({
                    Name: elm._document.data.value.mapValue.fields.Name.stringValue,
                    Code: elm._document.data.value.mapValue.fields.Code.integerValue,
                    CellNumber: elm._document.data.value.mapValue.fields.CellNumber.integerValue,
                    NIT: elm._document.data.value.mapValue.fields.NIT.integerValue,
                    SocialReason: elm._document.data.value.mapValue.fields.SocialReason.stringValue
                }))
    // using handleOnChange and the handleOnSubmit argument maps and includes on each value depending on the category given by handleOnChange
                setListItems([])
                setTestData(data)
                setIsFetching(false);
            })
            .catch(error => console.log(error.message))
    }
    // ---------------------

    
    // subscriber creator
    const [name, setName] = useState("")
    const [socialReason, setSocialReason] = useState("")
    const [cellNumber, setCellNumber] = useState("")
    const [code, setCode] = useState("")
    const [NIT, setNIT] = useState("")
    if (name === "" && TestData.length !== 0) {
        setName(TestData[0].Name)
    }
    if (socialReason === "" && TestData.length !== 0) {
        setSocialReason(TestData[0].SocialReason)
    }
    if (cellNumber === "" && TestData.length !== 0) {
        setCellNumber(TestData[0].CellNumber)
    }
    if (code === "" && TestData.length !== 0) {
        setCode(TestData[0].Code)
    }
    if (NIT === "" && TestData.length !== 0) {
        setNIT(TestData[0].NIT)
    }

    // check if it is empty, if it is, put the default values of the first object in the list, then send everything to Firebase
    function handleOnSubmit2(e) {
        e.preventDefault()
        if (name === "") {
            setName(document.getElementById("Name").defaultValue)
        }
        if (socialReason === "") {
            setSocialReason(document.getElementById("Socialreason").defaultValue)
        }
        if (cellNumber === "") {
            setCellNumber(document.getElementById("CellNumber").defaultValue)
        }
        if (code === "") {
            setCode(document.getElementById("Code").defaultValue)
        }
        if (NIT === "") {
            setNIT(document.getElementById("NIT").defaultValue)
        }

        const collecRef = collection(db, "TestData")
        addDoc(collecRef, { Name: name, SocialReason: socialReason, CellNumber: parseInt(cellNumber), Code: parseInt(code), NIT: parseInt(NIT) }).then(response => {
            alert("Tnx for the subcription!")
        }).catch(error => {
            console.log("eerrorsito:", error.message)
        })
    }
    //-------------- 


    // looks at the search box and sends it as an argument to Search
    const handleOnSubmit = (e) => {
        e.preventDefault();
        Search(e.target[0].value);
    }
    // assign the category for the filter
    const handleOnChange = (e) => {
        setFilterData(e.target.value)
    }
    // show modal
    const toModal = function () {
        if (displayModal === "none") {
            setDisplayModal("block")
        }
    }
    //-------------- 

    return (
        <div className='dropdown_total'>
            <div className='dropdown'>
                <div className='dropdown-btn'>
                    <select name="select" onChange={(e) => handleOnChange(e)}>
                        <option value="">Select</option>
                        <option value="Name">Name</option>
                        <option value="NIT">NIT</option>
                        <option value="SocialReason">Social Reason</option>
                        <option value="Code">Code</option>
                        <option value="CellNumber">Cell Number</option>
                    </select>
                    <form onSubmit={handleOnSubmit}>
                        <input className='dropdown-search' type="text" id='one'></input>
                        <input className='dropdown-submit' type="submit" id='two' value="Go"></input>
                    </form>
                </div>
            </div>

            <div className='bg_modal' id='modale' style={{ display: displayModal }}>
                <div className='box_modal'>
                    <button onClick={() => setDisplayModal("none")}>Close Form</button>
                    <form onSubmit={handleOnSubmit2}>
                        <label htmlFor='Name' style={{marginLeft: "2%"}}>Name: </label>
                        <input id="Name" type="text" name='Name' placeholder='Name...' defaultValue={TestData.length !== 0 && TestData[0].Name ? TestData[0].Name : ""} onChange={e => setName(e.target.value)}></input>

                        <label htmlFor='Socialreason' style={{marginLeft: "2%"}}>Social reason: </label>
                        <input id='Socialreason' type="text" name='SocialReason' placeholder='Social Reason...' defaultValue={TestData.length !== 0 && TestData[0].SocialReason ? TestData[0].SocialReason : ""} onChange={e => setSocialReason(e.target.value)}></input>
                        <br></br>
                        <label htmlFor='CellNumber' style={{marginLeft: "2%"}}>CellNumber: </label>
                        <input id='CellNumber' type="text" name='CellNumber' placeholder='Cell Number...' defaultValue={TestData.length !== 0 && TestData[0].CellNumber ? TestData[0].CellNumber : ""} onChange={e => setCellNumber(e.target.value)}></input>

                        <label htmlFor='Code' style={{marginLeft: "2%"}}>Code: </label>
                        <input id='Code' type="text" name='Code' placeholder='Code...' defaultValue={TestData.length !== 0 && TestData[0].Code ? TestData[0].Code : ""} onChange={e => setCode(e.target.value)}></input>
                        <br></br>
                        <label htmlFor='NIT' style={{marginLeft: "2%"}}>NIT: </label>
                        <input id='NIT' type="text" name='NIT' placeholder='NIT...' defaultValue={TestData.length !== 0 && TestData[0].NIT ? TestData[0].NIT : ""} onChange={e => setNIT(e.target.value)}></input>
                        <br></br>
                        <button type='submit'>Subscribe</button>
                    </form>
                </div>
            </div>

            <div style={{ heigth: "20px", display: showInfo }}>

                <ul
                    className="list-group-all"
                    style={{ heigth: "80px" }}
                >
                    {listItems !== undefined && listItems.length !== 0 ? listItems.map((elm, index) => (
                        <p className="list-group-item">{index === 0 ? <button className='create-btn' onClick={() => toModal()}>Create User</button> : ""}
                            {<p>
                                Name: {elm.Name}<br></br>
                                Social Reason: {elm.SocialReason}<br></br>
                                Cell Number: {elm.CellNumber}<br></br>
                                Code: {elm.Code}<br></br>
                                NIT: {elm.NIT}

                            </p>

                            }</p>
                    )) : <p>No users</p>}
                </ul>
                {isFetching && listItems.length !== TestData.length && "Fetching more Users..."}
            </div>

        </div>
    )
}

export default Dropdown