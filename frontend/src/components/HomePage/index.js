import './HomePage.css'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';

export default function HomePage() {
    const user = useSelector(state => state.session.user);

    return (
        <div className="home-page">
            <div id="top-div">
                <div id="title-div">
                    <h1>
                        The people platform— <br/>
                        Where interests<br/>
                        become friendships
                    </h1>
                    <p>Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.</p>
                </div>
                <div id="main-img-div">
                    <img id="main-img" src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=640" alt="holding hands" />
                </div>
            </div>
            <div id="mid-div">
                <h3>How Meetup Works</h3>
                <p>Meet new people who share your interests through online and in-person events. It’s free to create an account.</p>
            </div>
            <div id="bottom-links">
                <div className='link-cards'>
                    <img className="sub-imgs" src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=256" alt="carton computer" />
                    <Link className="link-homepage" to="/groups">See all goups</Link>
                    <p>Do what you love, meet others who love it, find your community. The rest is history!</p>
                </div>
                <div className='link-cards'>
                    <img className="sub-imgs" src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=256" alt="carton computer" />
                    <Link className="link-homepage" to="/events">Find an event</Link>
                    <p>Events are happening on just about any topic you can think of, from online gaming and photography to yoga and hiking.</p>
                </div>
                <div className='link-cards'>
                    <img className="sub-imgs"src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256" alt="carton computer" />
                    <Link to="/groups/new" className={user ? "link-homepage" : "disabled-link"}>Start a new group</Link>
                    <p>You don’t have to be an expert to gather people together and explore shared interests.</p>
                </div>
            </div>
            <div id="button-div-bottom">
                <button id='join-meetup'>Join Meetup</button>
            </div>
        </div>
    )
}
