const inputSearch = document.getElementById('search');

const buttonPrevPage = document.getElementById('prevPage');
const buttonNextPage = document.getElementById('nextPage');

const containerCards = document.querySelector('.container-cards');

const page = document.querySelector('#numberPage');

let prevPage;
let nextPage;

let numberPage = 0;

let characters = [];

getCharacter();

buttonNextPage.addEventListener('click', getNextPage);

buttonPrevPage.addEventListener('click', getPrevPage);

inputSearch.addEventListener('input', searchCharacter);

async function getCharacter() {
	try {
		const response = await fetch(
			'https://rickandmortyapi.com/api/character'
		).then((response) => response.json());

		characters = response.results;
		nextPage = response.info.next;
		numberPage++;
		page.innerHTML = `${numberPage}/42`;
		containerCards.innerHTML = '';
		for (const character of characters) {
			const lastSeen = await lastEpisode(character);
			const firstWord = character.species.split(' ');
			containerCards.innerHTML += `
						<div class='card'>
							<img id='imageCharacter' src='${character.image}'/>
							<div id='content'>
								<h3>${character.name}</h3>
								<div id='status'>
									<div class='statusColor ${
										character.status == 'Dead'
											? 'dead'
											: character.status == 'Alive'
											? 'alive'
											: 'unknown'
									}'>
									</div>
									<p>${character.status} -</p>
									<p>${firstWord[0]}</p>						
								</div>
								<div id='location'>
									<p>Last known location</p>
									<span>${character.location.name}</span>
								</div>
								<div id='episode'>
									<p>Last seen on</p>
									<span>${lastSeen}</span>
								</div>
							</div>
						</div>
						`;
		}
	} catch (error) {
		console.log('Erro no get!');
	}
}

async function getNextPage() {
	try {
		if (!nextPage) {
			return;
		}
		const response = await fetch(`${nextPage}`).then((response) =>
			response.json()
		);
		characters = response.results;
		prevPage = response.info.prev;
		nextPage = response.info.next;
		if (numberPage === 42) {
			return;
		}
		numberPage++;
		page.innerHTML = `${numberPage}/42`;
		containerCards.innerHTML = '';
		for (const character of characters) {
			const lastSeen = await lastEpisode(character);
			const firstWord = character.species.split(' ');
			containerCards.innerHTML += `
						<div class='card'>
							<img id='imageCharacter' src='${character.image}'/>
							<div id='content'>
								<h3>${character.name}</h3>
								<div id='status'>
									<div class='statusColor ${
										character.status == 'Dead'
											? 'dead'
											: character.status == 'Alive'
											? 'alive'
											: 'unknown'
									}'>
									</div>
									<p>${character.status} -</p>
									<p>${firstWord[0]}</p>						
								</div>
								<div id='location'>
									<p>Last known location</p>
									<span>${character.location.name}</span>
								</div>
								<div id='episode'>
									<p>Last seen on</p>
									<span>${lastSeen}</span>
								</div>
							</div>
						</div>
						`;
		}
	} catch (error) {
		console.log('Erro no get!');
	}
}

async function getPrevPage() {
	try {
		if (!prevPage) return;
		const response = await fetch(`${prevPage}`).then((response) =>
			response.json()
		);
		characters = response.results;
		prevPage = response.info.prev;
		nextPage = response.info.next;
		numberPage--;
		page.innerHTML = `${numberPage}/42`;
		containerCards.innerHTML = '';
		for (const character of characters) {
			const lastSeen = await lastEpisode(character);
			const firstWord = character.species.split(' ');
			containerCards.innerHTML += `
			<div class='card'>
				<img id='imageCharacter' src='${character.image}'/>
				<div id='content'>
					<h3>${character.name}</h3>
					<div id='status'>
						<div class='statusColor ${
							character.status == 'Dead'
								? 'dead'
								: character.status == 'Alive'
								? 'alive'
								: 'unknown'
						}'>
						</div>
						<p>${character.status} -</p>
						<p>${firstWord[0]}</p>						
					</div>
					<div id='location'>
						<p>Last known location</p>
						<span>${character.location.name}</span>
					</div>
					<div id='episode'>
						<p>Last seen on</p>
						<span>${lastSeen}</span>
					</div>
				</div>
			</div>
			`;
		}
	} catch (error) {
		console.log('Erro no get!');
	}
}

async function searchCharacter() {
	const filteredCharacters = characters.filter((character) =>
		character.name.toUpperCase().includes(inputSearch.value.toUpperCase())
	);
	containerCards.innerHTML = '';

	for (const character of filteredCharacters) {
		const lastSeen = await lastEpisode(character);
		const firstWord = character.species.split(' ');
		containerCards.innerHTML += `
		<div class='card'>
			<img id='imageCharacter' src='${character.image}'/>
			<div id='content'>
				<h3>${character.name}</h3>
				<div id='status'>
					<div class='statusColor ${
						character.status == 'Dead'
							? 'dead'
							: character.status == 'Alive'
							? 'alive'
							: 'unknown'
					}'>
					</div>
					<p>${character.status} -</p>
					<p>${firstWord[0]}</p>						
				</div>
				<div id='location'>
					<p>Last known location</p>
					<span>${character.location.name}</span>
				</div>
				<div id='episode'>
					<p>Last seen on</p>
					<span>${lastSeen}</span>
				</div>
			</div>
		</div>
		`;
	}
	console.log(characters);
}

async function lastEpisode(character) {
	const ep = character.episode.length - 1;
	try {
		const response = await fetch(`${character.episode[ep]}`).then((value) =>
			value.json()
		);
		return response.name;
	} catch (error) {
		console.log('Erro no Get');
	}
}
