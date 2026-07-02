const TMDB = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: string; title: string; description: string; thumbnailUrl: string; posterUrl: string; backdropUrl: string; trailerUrl: string; videoUrl: string; duration: string; year: number; rating: number; genres: string[]; language: string; maturityRating: string; cast: string[]; director: string; isTrending: boolean; isTopRated: boolean; isNewRelease: boolean; category: 'movie' | 'tvshow';
}

export interface Season {
  id: string; number: number; episodes: Episode[];
}

export interface Episode {
  id: string; title: string; description: string; thumbnailUrl: string; videoUrl: string; duration: string; number: number;
}

const allMovies: Movie[] = [
  {
    id: '1', title: 'Inception', description: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '2h 28m', year: 2010, rating: 8.8, genres: ['Action', 'Science Fiction', 'Thriller'], language: 'English', maturityRating: 'PG-13',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'], director: 'Christopher Nolan', isTrending: true, isTopRated: true, isNewRelease: false, category: 'movie',
  },
  {
    id: '2', title: 'The Dark Knight', description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '2h 32m', year: 2008, rating: 9.0, genres: ['Action', 'Crime', 'Drama'], language: 'English', maturityRating: 'PG-13',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Gary Oldman'], director: 'Christopher Nolan', isTrending: true, isTopRated: true, isNewRelease: false, category: 'movie',
  },
  {
    id: '3', title: 'Interstellar', description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked with piloting a spacecraft along with a team of researchers to find a new planet for humans.",
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '2h 49m', year: 2014, rating: 8.7, genres: ['Adventure', 'Drama', 'Science Fiction'], language: 'English', maturityRating: 'PG-13',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'], director: 'Christopher Nolan', isTrending: true, isTopRated: true, isNewRelease: false, category: 'movie',
  },
  {
    id: '4', title: 'Stranger Things', description: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '50m', year: 2016, rating: 8.7, genres: ['Drama', 'Fantasy', 'Horror'], language: 'English', maturityRating: 'TV-14',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'David Harbour', 'Winona Ryder'], director: 'The Duffer Brothers', isTrending: true, isTopRated: true, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '5', title: 'Breaking Bad', description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '49m', year: 2008, rating: 9.5, genres: ['Crime', 'Drama', 'Thriller'], language: 'English', maturityRating: 'TV-MA',
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn', 'Dean Norris'], director: 'Vince Gilligan', isTrending: true, isTopRated: true, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '6', title: 'The Crown', description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '58m', year: 2016, rating: 8.6, genres: ['Drama', 'History'], language: 'English', maturityRating: 'TV-MA',
    cast: ['Claire Foy', 'Olivia Colman', 'Imelda Staunton', 'Matt Smith'], director: 'Peter Morgan', isTrending: false, isTopRated: true, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '7', title: 'Money Heist', description: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '50m', year: 2017, rating: 8.2, genres: ['Action', 'Crime', 'Mystery'], language: 'Spanish', maturityRating: 'TV-MA',
    cast: ['Úrsula Corberó', 'Álvaro Morte', 'Itziar Ituño', 'Pedro Alonso'], director: 'Álex Pina', isTrending: true, isTopRated: false, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '8', title: 'Squid Game', description: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games. Inside, a tempting prize awaits with deadly high stakes.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '55m', year: 2021, rating: 8.0, genres: ['Drama', 'Mystery', 'Thriller'], language: 'Korean', maturityRating: 'TV-MA',
    cast: ['Lee Jung-jae', 'Park Hae-soo', 'Wi Ha-joon', 'Jung Ho-yeon'], director: 'Hwang Dong-hyuk', isTrending: true, isTopRated: true, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '9', title: 'Dune', description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '2h 35m', year: 2021, rating: 8.0, genres: ['Adventure', 'Drama', 'Science Fiction'], language: 'English', maturityRating: 'PG-13',
    cast: ['Timothée Chalamet', 'Rebecca Ferguson', 'Zendaya', 'Oscar Isaac'], director: 'Denis Villeneuve', isTrending: false, isTopRated: true, isNewRelease: false, category: 'movie',
  },
  {
    id: '10', title: 'Parasite', description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '2h 12m', year: 2019, rating: 8.5, genres: ['Comedy', 'Drama', 'Thriller'], language: 'Korean', maturityRating: 'R',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik'], director: 'Bong Joon-ho', isTrending: false, isTopRated: true, isNewRelease: false, category: 'movie',
  },
  {
    id: '11', title: 'The Witcher', description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '55m', year: 2019, rating: 8.2, genres: ['Action', 'Adventure', 'Fantasy'], language: 'English', maturityRating: 'TV-MA',
    cast: ['Henry Cavill', 'Anya Chalotra', 'Freya Allan', 'Joey Batey'], director: 'Lauren Schmidt Hissrich', isTrending: true, isTopRated: false, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '12', title: 'The Shawshank Redemption', description: 'Over the course of several years, two convicts form a friendship, seeking consolation and eventual redemption through basic compassion.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '2h 22m', year: 1994, rating: 9.3, genres: ['Drama'], language: 'English', maturityRating: 'R',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton', 'William Sadler'], director: 'Frank Darabont', isTrending: false, isTopRated: true, isNewRelease: false, category: 'movie',
  },
  {
    id: '13', title: 'Pulp Fiction', description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '2h 34m', year: 1994, rating: 8.9, genres: ['Crime', 'Drama'], language: 'English', maturityRating: 'R',
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson', 'Bruce Willis'], director: 'Quentin Tarantino', isTrending: false, isTopRated: true, isNewRelease: false, category: 'movie',
  },
  {
    id: '14', title: 'The Mandalorian', description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '40m', year: 2019, rating: 8.7, genres: ['Action', 'Adventure', 'Science Fiction'], language: 'English', maturityRating: 'TV-14',
    cast: ['Pedro Pascal', 'Gina Carano', 'Carl Weathers', 'Giancarlo Esposito'], director: 'Jon Favreau', isTrending: true, isTopRated: true, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '15', title: 'Oppenheimer', description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '3h', year: 2023, rating: 8.4, genres: ['Drama', 'History', 'Thriller'], language: 'English', maturityRating: 'R',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'], director: 'Christopher Nolan', isTrending: true, isTopRated: false, isNewRelease: true, category: 'movie',
  },
  {
    id: '16', title: 'Wednesday', description: "Follows Wednesday Addams' years as a student at Nevermore Academy, where she attempts to master her emerging psychic ability and solve a murder mystery.",
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '50m', year: 2022, rating: 8.2, genres: ['Comedy', 'Crime', 'Fantasy'], language: 'English', maturityRating: 'TV-14',
    cast: ['Jenna Ortega', 'Catherine Zeta-Jones', 'Luis Guzmán', 'Gwendoline Christie'], director: 'Tim Burton', isTrending: true, isTopRated: false, isNewRelease: true, category: 'tvshow',
  },
  {
    id: '17', title: 'Everything Everywhere All at Once', description: 'A middle-aged Chinese immigrant is swept up into an insane adventure where she alone can save existence by exploring other universes.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '2h 19m', year: 2022, rating: 7.8, genres: ['Action', 'Adventure', 'Comedy', 'Science Fiction'], language: 'English', maturityRating: 'R',
    cast: ['Michelle Yeoh', 'Stephanie Hsu', 'Ke Huy Quan', 'Jamie Lee Curtis'], director: 'Daniel Kwan', isTrending: false, isTopRated: true, isNewRelease: false, category: 'movie',
  },
  {
    id: '18', title: 'The Last of Us', description: 'After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity\'s last hope.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '50m', year: 2023, rating: 8.8, genres: ['Action', 'Adventure', 'Drama'], language: 'English', maturityRating: 'TV-MA',
    cast: ['Pedro Pascal', 'Bella Ramsey', 'Anna Torv', 'Lamar Johnson'], director: 'Craig Mazin', isTrending: true, isTopRated: true, isNewRelease: true, category: 'tvshow',
  },
  {
    id: '19', title: 'Avatar: The Way of Water', description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '3h 12m', year: 2022, rating: 7.7, genres: ['Action', 'Adventure', 'Fantasy', 'Science Fiction'], language: 'English', maturityRating: 'PG-13',
    cast: ['Sam Worthington', 'Zoe Saldaña', 'Sigourney Weaver', 'Stephen Lang'], director: 'James Cameron', isTrending: false, isTopRated: false, isNewRelease: true, category: 'movie',
  },
  {
    id: '20', title: 'Dark', description: 'A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes the relationships among four families.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '55m', year: 2017, rating: 8.7, genres: ['Crime', 'Drama', 'Mystery', 'Science Fiction'], language: 'German', maturityRating: 'TV-MA',
    cast: ['Louis Hofmann', 'Karoline Eichhorn', 'Lisa Vicari', 'Máté Wierny'], director: 'Baran bo Odar', isTrending: false, isTopRated: true, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '21', title: 'John Wick', description: 'An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '1h 41m', year: 2014, rating: 7.4, genres: ['Action', 'Crime', 'Thriller'], language: 'English', maturityRating: 'R',
    cast: ['Keanu Reeves', 'Michael Nyqvist', 'Alfie Allen', 'Willem Dafoe'], director: 'Chad Stahelski', isTrending: true, isTopRated: false, isNewRelease: false, category: 'movie',
  },
  {
    id: '22', title: 'Lupin', description: 'Inspired by the adventures of Arsène Lupin, gentleman thief Assane Diop sets out to avenge his father for an injustice inflicted by a wealthy family.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '45m', year: 2021, rating: 7.5, genres: ['Action', 'Crime', 'Drama', 'Mystery'], language: 'French', maturityRating: 'TV-14',
    cast: ['Omar Sy', 'Ludivine Sagnier', 'Clotilde Hesme', 'Vincent Londez'], director: 'George Kay', isTrending: true, isTopRated: false, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '23', title: 'The Matrix', description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth about his reality.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '2h 16m', year: 1999, rating: 8.7, genres: ['Action', 'Science Fiction'], language: 'English', maturityRating: 'R',
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss', 'Hugo Weaving'], director: 'Lana Wachowski', isTrending: false, isTopRated: true, isNewRelease: false, category: 'movie',
  },
  {
    id: '24', title: 'Chernobyl', description: 'In April 1986, an explosion at the Chernobyl nuclear power plant in the USSR becomes one of the world\'s worst man-made catastrophes.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '55m', year: 2019, rating: 9.4, genres: ['Drama', 'History', 'Thriller'], language: 'English', maturityRating: 'TV-MA',
    cast: ['Jessie Buckley', 'Jared Harris', 'Stellan Skarsgård', 'Paul Ritter'], director: 'Johan Renck', isTrending: false, isTopRated: true, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '25', title: 'La La Land', description: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '2h 8m', year: 2016, rating: 8.0, genres: ['Comedy', 'Drama', 'Music', 'Romance'], language: 'English', maturityRating: 'PG-13',
    cast: ['Ryan Gosling', 'Emma Stone', 'John Legend', 'Rosemarie DeWitt'], director: 'Damien Chazelle', isTrending: false, isTopRated: true, isNewRelease: false, category: 'movie',
  },
  {
    id: '26', title: 'Alice in Borderland', description: 'A group of bored slacker teens are transported to a parallel version of Tokyo where they are forced to compete in a series of sadistic, deadly games.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '50m', year: 2020, rating: 7.6, genres: ['Action', 'Drama', 'Fantasy', 'Thriller'], language: 'Japanese', maturityRating: 'TV-MA',
    cast: ['Kento Yamazaki', 'Tao Tsuchiya', 'Nijiro Murakami', 'Ayaka Miyoshi'], director: 'Shinsuke Sato', isTrending: true, isTopRated: false, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '27', title: 'Barbie', description: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '1h 54m', year: 2023, rating: 7.0, genres: ['Adventure', 'Comedy', 'Fantasy'], language: 'English', maturityRating: 'PG-13',
    cast: ['Margot Robbie', 'Ryan Gosling', 'America Ferrera', 'Kate McKinnon'], director: 'Greta Gerwig', isTrending: true, isTopRated: false, isNewRelease: true, category: 'movie',
  },
  {
    id: '28', title: 'House of the Dragon', description: "The story of the House Targaryen set 200 years before the events of Game of Thrones, following the beginning of the end of their dynasty.",
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '55m', year: 2022, rating: 8.5, genres: ['Action', 'Adventure', 'Drama', 'Fantasy'], language: 'English', maturityRating: 'TV-MA',
    cast: ['Emma D\'Arcy', 'Matt Smith', 'Olivia Cooke', 'Rhys Ifans'], director: 'Ryan Condal', isTrending: true, isTopRated: true, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '29', title: 'Fight Club', description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '2h 19m', year: 1999, rating: 8.8, genres: ['Drama'], language: 'English', maturityRating: 'R',
    cast: ['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter', 'Meat Loaf'], director: 'David Fincher', isTrending: false, isTopRated: true, isNewRelease: false, category: 'movie',
  },
  {
    id: '30', title: 'Narcos', description: 'A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar, as well as the many other drug kingpins who plagued the country through the years.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '49m', year: 2015, rating: 8.8, genres: ['Crime', 'Drama, Biography'], language: 'English', maturityRating: 'TV-MA',
    cast: ['Pedro Pascal', 'Wagner Moura', 'Boyd Holbrook', 'Alberto Ammann'], director: 'Chris Brancato', isTrending: false, isTopRated: true, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '31', title: 'Joker', description: 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime that brings him face-to-face with his alter-ego.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '2h 2m', year: 2019, rating: 8.4, genres: ['Crime', 'Drama', 'Thriller'], language: 'English', maturityRating: 'R',
    cast: ['Joaquin Phoenix', 'Robert De Niro', 'Zazie Beetz', 'Frances Conroy'], director: 'Todd Phillips', isTrending: true, isTopRated: true, isNewRelease: false, category: 'movie',
  },
  {
    id: '32', title: 'Bridgerton', description: 'Wealth, lust, and betrayal set in the backdrop of Regency era England, seen through the eyes of the powerful Bridgerton family.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '58m', year: 2020, rating: 7.4, genres: ['Drama', 'Romance'], language: 'English', maturityRating: 'TV-MA',
    cast: ['Adjoa Andoh', 'Julie Andrews', 'Nicola Coughlan', 'Phoebe Dynevor'], director: 'Chris Van Dusen', isTrending: true, isTopRated: false, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '33', title: 'The Boys', description: 'A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '55m', year: 2019, rating: 8.7, genres: ['Action', 'Comedy', 'Crime', 'Science Fiction'], language: 'English', maturityRating: 'TV-MA',
    cast: ['Karl Urban', 'Jack Quaid', 'Antony Starr', 'Erin Moriarty'], director: 'Eric Kripke', isTrending: true, isTopRated: true, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '34', title: 'The Good Place', description: 'Four people and their otherworldly frienemy struggle in the afterlife to define what it means to be good.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '22m', year: 2016, rating: 8.2, genres: ['Comedy', 'Drama', 'Fantasy'], language: 'English', maturityRating: 'TV-PG',
    cast: ['Kristen Bell', 'William Jackson Harper', 'Jameela Jamil', 'D\'Arcy Carden'], director: 'Michael Schur', isTrending: false, isTopRated: true, isNewRelease: false, category: 'tvshow',
  },
  {
    id: '35', title: 'Tenet', description: 'Armed with only one word, Tenet, and fighting for the survival of the entire world, a Protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '2h 30m', year: 2020, rating: 7.3, genres: ['Action', 'Science Fiction', 'Thriller'], language: 'English', maturityRating: 'PG-13',
    cast: ['John David Washington', 'Robert Pattinson', 'Elizabeth Debicki', 'Kenneth Branagh'], director: 'Christopher Nolan', isTrending: false, isTopRated: false, isNewRelease: false, category: 'movie',
  },
  {
    id: '36', title: 'Squid Game Season 2', description: 'New players enter the deadly competition with higher stakes and even more treacherous games await those desperate enough to risk their lives for a fortune.',
    thumbnailUrl: `${TMDB}/w300/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, posterUrl: `${TMDB}/w500/qJ2tW6WMUDux911BytT9B6vI8M.jpg`, backdropUrl: `${TMDB}/w1280/wwemzKWzjKYJFfCeiB57q3r4Bcm.png`,
    trailerUrl: '', videoUrl: '', duration: '55m', year: 2024, rating: 8.5, genres: ['Drama', 'Mystery', 'Thriller'], language: 'Korean', maturityRating: 'TV-MA',
    cast: ['Lee Jung-jae', 'Wi Ha-joon', 'Park Gyu-young', 'Jo Yu-ri'], director: 'Hwang Dong-hyuk', isTrending: true, isTopRated: false, isNewRelease: true, category: 'tvshow',
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAllMovies = async (): Promise<Movie[]> => {
  await delay(200);
  return [...allMovies];
};

export const getTrendingMovies = async (): Promise<Movie[]> => {
  await delay(200);
  return allMovies.filter((m) => m.isTrending);
};

export const getTopRatedMovies = async (): Promise<Movie[]> => {
  await delay(200);
  return allMovies.filter((m) => m.isTopRated);
};

export const getNewReleases = async (): Promise<Movie[]> => {
  await delay(200);
  return allMovies.filter((m) => m.isNewRelease);
};

export const getPopularTVShows = async (): Promise<Movie[]> => {
  await delay(200);
  return allMovies.filter((m) => m.category === 'tvshow');
};

export const getMovieById = async (id: string): Promise<Movie | null> => {
  await delay(200);
  return allMovies.find((m) => m.id === id) || null;
};

export const searchMovies = async (query: string, filters?: { genre?: string; language?: string; rating?: number; year?: number; category?: string }): Promise<Movie[]> => {
  await delay(300);
  let results = [...allMovies];
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.genres.some((g) => g.toLowerCase().includes(q)) ||
        m.cast.some((c) => c.toLowerCase().includes(q)) ||
        m.director.toLowerCase().includes(q)
    );
  }
  if (filters) {
    if (filters.genre) results = results.filter((m) => m.genres.some((g) => g.toLowerCase() === filters.genre!.toLowerCase()));
    if (filters.language) results = results.filter((m) => m.language.toLowerCase() === filters.language!.toLowerCase());
    if (filters.rating) results = results.filter((m) => m.rating >= filters.rating!);
    if (filters.year) results = results.filter((m) => m.year === filters.year);
    if (filters.category && filters.category !== 'all') results = results.filter((m) => m.category === filters.category);
  }
  return results;
};

export const getRecommendations = async (_userId?: string): Promise<Movie[]> => {
  await delay(300);
  return allMovies.filter((m) => m.isTrending || m.isTopRated).slice(0, 10);
};

export const getMoodRecommendations = async (mood: string): Promise<Movie[]> => {
  await delay(300);
  const moodMap: Record<string, string[]> = {
    happy: ['Comedy', 'Music'],
    sad: ['Drama', 'Romance'],
    excited: ['Action', 'Thriller'],
    relaxed: ['Fantasy', 'Comedy'],
    scared: ['Horror', 'Thriller'],
    romantic: ['Romance', 'Drama'],
    funny: ['Comedy'],
    mysterious: ['Mystery', 'Crime', 'Thriller'],
  };
  const genres = moodMap[mood.toLowerCase()] || [];
  return allMovies.filter((m) => m.genres.some((g) => genres.includes(g))).slice(0, 8);
};

export const getSimilarMovies = async (movieId: string): Promise<Movie[]> => {
  await delay(200);
  const movie = allMovies.find((m) => m.id === movieId);
  if (!movie) return [];
  return allMovies.filter(
    (m) => m.id !== movieId && m.genres.some((g) => movie.genres.includes(g))
  ).slice(0, 8);
};
