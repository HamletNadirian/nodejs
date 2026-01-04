import mongoose from 'mongoose';
import Producer from '../producer/producer.model';
import Movie from '../movie/movie.model';
import Rating from '../rating/rating.model';
import log4js from 'log4js';

const logger = log4js.getLogger();

export const seedDatabase = async (): Promise<void> => {
    try {
        logger.info('🌱 Starting database seeding...');

        await Producer.deleteMany({});
        await Movie.deleteMany({});
        await Rating.deleteMany({});
        logger.info('🗑️  Collections cleared');

        const producers = await Producer.create([
            {
                name: 'Warner Bros. Pictures',
                country: 'США',
                foundedYear: 1923,
                website: 'https://www.warnerbros.com',
                bio: 'Американская киностудия, одна из крупнейших в мире',
            },
            {
                name: 'Paramount Pictures',
                country: 'США',
                foundedYear: 1912,
                website: 'https://www.paramount.com',
                bio: 'Одна из старейших голливудских киностудий',
            },
            {
                name: 'Universal Pictures',
                country: 'США',
                foundedYear: 1912,
                website: 'https://www.universalpictures.com',
                bio: 'Американская киностудия, принадлежащая Comcast',
            },
            {
                name: 'Studio Ghibli',
                country: 'Япония',
                foundedYear: 1985,
                website: 'https://www.ghibli.jp',
                bio: 'Японская анимационная студия, основанная Хаяо Миядзаки',
            },
            {
                name: 'Fox 2000 Pictures\n',
                country: 'USA',
                foundedYear: 1920,
                website: 'https://www.disneystudios.com/',
                bio: 'Американская кинокомпания в The Walt Disney Studios.',
            },
        ]);

        logger.info(`✅ Created ${producers.length} producers`);

        const movies = await Movie.create([
            {
                title: 'Интерстеллар',
                description: 'Фантастический фильм о путешествии через червоточину в поисках нового дома для человечества',
                releaseYear: 2014,
                duration: 169,
                genre: ['фантастика', 'драма', 'приключения'],
                producerId: producers[0]._id,
            },
            {
                title: 'Начало',
                description: 'Фильм о профессиональных ворах, которые внедряются в сны, чтобы украсть идеи',
                releaseYear: 2010,
                duration: 148,
                genre: ['фантастика', 'боевик', 'триллер'],
                producerId: producers[0]._id,
            },
            {
                title: 'Титаник',
                description: 'История любви на фоне гибели легендарного лайнера',
                releaseYear: 1997,
                duration: 195,
                genre: ['драма', 'мелодрама', 'исторический'],
                producerId: producers[1]._id,
            },
            {
                title: 'Унесённые призраками',
                description: 'Аниме о девочке, попавшей в мир духов',
                releaseYear: 2001,
                duration: 125,
                genre: ['аниме', 'фэнтези', 'приключения'],
                producerId: producers[3]._id,
            },
            {
                title: 'Бойцовский клуб!',
                description: 'Бессонный офисный работник и беззаботный мыльный мастер...',
                releaseYear: 1999,
                duration: 139,
                genre: ['Чёрная комедия', 'драма'],
                producerId: producers[4]._id,
            },
            {
                title: 'Форрест Гамп',
                description: 'История жизни человека с низким IQ, который стал свидетелем ключевых событий XX века',
                releaseYear: 1994,
                duration: 142,
                genre: ['драма', 'комедия', 'мелодрама'],
                producerId: producers[1]._id,
            },
            {
                title: 'Побег из Шоушенка',
                description: 'История о невинно осужденном банкире и его побеге из тюрьмы',
                releaseYear: 1994,
                duration: 142,
                genre: ['драма'],
                producerId: producers[2]._id,
            },
        ]);

        logger.info(`✅ Created ${movies.length} movies`);

        const ratings = await Rating.create([
            {
                movieId: movies[0]._id,
                score: 10,
                comment: 'Шедевр! Один из лучших фильмов в истории кино',
                createdBy: 'Алексей Петров',
                ratingDate: new Date('2024-01-10'),
            },
            {
                movieId: movies[0]._id,
                score: 9,
                comment: 'Отличный фильм, но слишком сложный для некоторых',
                createdBy: 'Мария Иванова',
                ratingDate: new Date('2024-01-12'),
            },
            {
                movieId: movies[0]._id,
                score: 8,
                comment: 'Хорошая научная фантастика',
                createdBy: 'Дмитрий Сидоров',
                ratingDate: new Date('2024-01-15'),
            },

            {
                movieId: movies[1]._id,
                score: 9,
                comment: 'Гениальный сюжет!',
                createdBy: 'Ольга Николаева',
                ratingDate: new Date('2024-01-11'),
            },
            {
                movieId: movies[1]._id,
                score: 7,
                comment: 'Сложно понять с первого просмотра',
                createdBy: 'Иван Кузнецов',
                ratingDate: new Date('2024-01-13'),
            },

            {
                movieId: movies[2]._id,
                score: 10,
                comment: 'Вечная классика!',
                createdBy: 'Анна Смирнова',
                ratingDate: new Date('2024-01-14'),
            },
            {
                movieId: movies[2]._id,
                score: 8,
                comment: 'Хороший фильм, но слишком длинный',
                createdBy: 'Сергей Попов',
                ratingDate: new Date('2024-01-16'),
            },

            {
                movieId: movies[3]._id,
                score: 10,
                comment: 'Лучшее аниме всех времен!',
                createdBy: 'Татьяна Морозова',
                ratingDate: new Date('2024-01-09'),
            },

            {
                movieId: movies[4]._id,
                score: 9,
                comment: 'Писать рецензии на фильмы, состоящие в топе лучших - дело воистину..',
                createdBy: 'Михаил Брашинский',
                ratingDate: new Date('2024-01-01'),
            },
            {
                movieId: movies[4]._id,
                score: 8,
                comment: 'Классика советского кино',
                createdBy: 'Елена Зайцева',
                ratingDate: new Date('2024-01-02'),
            },

            {
                movieId: movies[5]._id,
                score: 10,
                comment: 'Фильм, который меняет жизнь',
                createdBy: 'Павел Соколов',
                ratingDate: new Date('2024-01-08'),
            },
            {
                movieId: movies[5]._id,
                score: 9,
                comment: 'Том Хэнкс великолепен!',
                createdBy: 'Юлия Павлова',
                ratingDate: new Date('2024-01-07'),
            },

            {
                movieId: movies[6]._id,
                score: 10,
                comment: '№1 в моем рейтинге!',
                createdBy: 'Михаил Новиков',
                ratingDate: new Date('2024-01-05'),
            },
            {
                movieId: movies[6]._id,
                score: 9,
                comment: 'Блестящий сценарий и актерская игра',
                createdBy: 'Наталья Федорова',
                ratingDate: new Date('2024-01-06'),
            },
        ]);

        logger.info(`✅ Created ${ratings.length} ratings`);

        const stats = {
            producers: producers.length,
            movies: movies.length,
            ratings: ratings.length,
            averageRatings: {} as Record<string, number>,
        };

        for (const movie of movies) {
            const movieRatings = ratings.filter(r => r.movieId.equals(movie._id));
            if (movieRatings.length > 0) {
                const avg = movieRatings.reduce((sum, r) => sum + r.score, 0) / movieRatings.length;
                stats.averageRatings[movie.title as string] = parseFloat(avg.toFixed(2));

            }
        }

        logger.info('📊 Database seeding completed successfully!');
        logger.info('Statistics:', stats);

        console.log('\n========================================');
        console.log('🌱 DATABASE SEEDING COMPLETE');
        console.log('========================================');
        console.log(`Producers: ${stats.producers}`);
        console.log(`Movies: ${stats.movies}`);
        console.log(`Ratings: ${stats.ratings}`);
        console.log('\nAverage ratings:');
        Object.entries(stats.averageRatings).forEach(([movie, rating]) => {
            console.log(`  ${movie}: ${rating}/10`);
        });
        console.log('========================================\n');

    } catch (error) {
        logger.error('❌ Error during database seeding:', error);
        throw error;
    }
};