import React from 'react';
import { Link, useParams } from 'react-router-dom';
import fakeData from '../../data/fakeData.json';
import Room from '../Room/Room';
import './Book.css';

const Book = () => {
    const {bedType} = useParams(); 
    const rooms = fakeData.find(room => room.bedType === bedType);
    return (
        <div style={{textAlign: 'center'}}>
            <h1 style={{color:'blue'}}>Congratulations... Your <span style={{color:'orange'}}>{bedType}</span> Room is Booked Successfully</h1>
            <h2 style={{color:'blue'}}>Thank You for With Us</h2>
            <p>Want a <Link to="/home">different room?</Link> </p>
            <div className="booked-room">
            <Room room={rooms} book={false}></Room>
            </div>
        </div>
    );
};

export default Book;