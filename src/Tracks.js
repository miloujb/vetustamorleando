import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { ClientID, ClientSecret } from "./secrets"

const Tracks = () => {
	const [token, setToken] = useState('');
	const [tracks, setTracks] = useState([]);
	//declare artist as Vetusta
    const id = '6J6yx1t3nwIDyPXk5xa7O8';
	// Spain market
    const market = 'ES'; 

	useEffect(()=>{
		axios('https://accounts.spotify.com/api/token', {
			'method': 'POST',
			'headers': {
				 'Content-Type':'application/x-www-form-urlencoded',
				 'Authorization': 'Basic ' + (new Buffer(ClientID + ':' + ClientSecret).toString('base64')),
			},
			data: 'grant_type=client_credentials'
		}).then(tokenresponse => {
			console.log(tokenresponse.data.access_token);
			setToken(tokenresponse.data.access_token);

			
			axios(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=${market}`,{
				'method': 'GET',
				'headers': {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': 'Bearer ' + tokenresponse.data.access_token
				}
			}).then(trackresponse=> {
				console.log(trackresponse.data.tracks);
				setTracks(trackresponse.data.tracks);
			}).catch(error=> console.log(error))
		}).catch(error => console.log(error));
	},[])

	function trackPopularity(data){
        let plotData = [];

		let names = [];
		let popularity = [];

		data.map(each => {
			names.push(each.name);
			popularity.push(each.popularity);
		})

		plotData['names'] = names;
		plotData['popularity'] = popularity;

		return plotData;
    }

    return(
        <div>
            <Plot data ={[{
                type: 'bar',
                x: trackPopularity(tracks)['names'],
                y: trackPopularity(tracks)['popularity'],
                marker: {color: 'blue'}
            }
        ]} 
        layout={{width: 1000, height: 600, title: 'Most popular Vetusta Morla songs in Spain'}}
        />
        </div>
    )


}


export default Tracks;