import './HomePage.css'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import OpenModalButton from '../OpenModalButton';
import SignupFormModal from '../SignupFormModal';
import { useState, useEffect, useRef } from 'react';

export default function HomePage() {
    const user = useSelector(state => state.session.user);

    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    useEffect(() => {
      if (!showMenu) return;

      const closeMenu = (e) => {
        if (!ulRef.current.contains(e.target)) {
          setShowMenu(false);
        }
      };

      document.addEventListener('click', closeMenu);

      return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    return (
        <>
            <img className="bg-image" src="https://img.freepik.com/free-vector/colorful-memphis-design-background-vector_53876-62501.jpg?w=1380&t=st=1686169412~exp=1686170012~hmac=c153d6aa6fe9b46039a2a734ec9f2b32b0ad0a15bb1f12ab917e129c6e1da8ff" alt="background colors"/>
            <div className="home-page">
                <div id="top-div">
                    <div id="title-div">
                        <h1>
                            The nerd platform— <br/>
                            Where coding interests<br/>
                            become friendships
                        </h1>
                        <p>Whatever your interest, from C++ and hardware to JS and even machine learning, there are thousands of people who share it on CodingMeetup. Events are happening every day—sign up to join the fun.</p>
                    </div>
                    <div id="main-img-div">
                        <img id="main-img" src="https://cdn.pixabay.com/photo/2015/05/13/03/09/robots-764951_1280.png" alt="four robots"/>
                    </div>
                </div>
                <div id="mid-div">
                    <h3>How CodingMeetup Works</h3>
                    <p>Meet other programers who share your interests through online and in-person events. It’s free to create an account.</p>
                </div>
                <div id="lower-div">
                    <div id="bottom-links">
                        <div className='link-cards'>
                            <img className="sub-imgs" src="https://cdn.pixabay.com/photo/2018/09/26/09/18/pixel-cells-3704067_1280.png" alt="cartoon-name-tag"/>
                            <Link className="link-homepage" to="/groups">See all groups</Link>
                            <p>Do what you love, meet others who love it, find your community. The rest is history!</p>
                        </div>
                        <div className='link-cards'>
                            <img className="sub-imgs" src="https://cdn.pixabay.com/photo/2018/09/17/09/47/pixel-3683373_1280.png" alt="carton computer" />
                            <Link className="link-homepage" to="/events">Find an event</Link>
                            <p>Events are happening on just about any topic you can think of, from hackathons to coding bootcamps and open source projects.</p>
                        </div>
                        <div className='link-cards'>
                            <img className="sub-imgs"src="https://cdn.pixabay.com/photo/2014/04/02/10/21/rocketship-303591_1280.png" alt="cartoon rocket ship"/>
                            <Link to="/groups/new" className={user ? "link-homepage" : "disabled-link"}>Start a new group</Link>
                            <p>You don’t have to be an expert to gather people together and explore shared interests.</p>
                        </div>
                    </div>
                    <div id="button-div-bottom">
                        {!user && <OpenModalButton
                            buttonText="Join CodingMeetup"
                            onButtonClick={closeMenu}
                            modalComponent={<SignupFormModal />}
                        />}
                    </div>
                </div>
            </div>
        </>
    )
}
