import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OMDB_API_KEY } from '../config';

export default function DetailsScreen({ route }) {
  const id = route?.params?.id;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('ID фільму не вказано');
      setLoading(false);
      return;
    }

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`
        );
        const data = await res.json();

        if (data.Response === 'True') {
          setMovie(data);
        } else {
          setError(data.Error || 'Не вдалося завантажити інформацію про фільм');
        }
      } catch (err) {
        setError('Помилка під час завантаження. Перевірте підключення до інтернету.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Завантаження...</Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#ff3b30" />
        <Text style={styles.errorText}>{error || 'Фільм не знайдено'}</Text>
      </View>
    );
  }

  const InfoRow = ({ icon, label, value }) => {
    if (!value || value === 'N/A') return null;
    return (
      <View style={styles.infoRow}>
        <Ionicons name={icon} size={20} color="#007AFF" style={styles.infoIcon} />
        <Text style={styles.infoLabel}>{label}:</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    );
  };

  const posterUri = movie.Poster && movie.Poster !== 'N/A' 
    ? String(movie.Poster) 
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.posterContainer}>
        <Image 
          source={{ uri: posterUri }} 
          style={styles.poster}
          resizeMode="contain"
        />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{movie.Title}</Text>
        
        <View style={styles.metaContainer}>
          {movie.Year && (
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={16} color="#666" />
              <Text style={styles.metaText}>{movie.Year}</Text>
            </View>
          )}
          {movie.Runtime && movie.Runtime !== 'N/A' && (
            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color="#666" />
              <Text style={styles.metaText}>{movie.Runtime}</Text>
            </View>
          )}
          {movie.Rated && movie.Rated !== 'N/A' && (
            <View style={styles.metaItem}>
              <Ionicons name="shield-checkmark" size={16} color="#666" />
              <Text style={styles.metaText}>{movie.Rated}</Text>
            </View>
          )}
        </View>

        {movie.Plot && movie.Plot !== 'N/A' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Опис</Text>
            <Text style={styles.plot}>{movie.Plot}</Text>
          </View>
        )}

        <View style={styles.section}>
          <InfoRow icon="people" label="Режисер" value={movie.Director} />
          <InfoRow icon="person" label="Актори" value={movie.Actors} />
          <InfoRow icon="film" label="Жанр" value={movie.Genre} />
          <InfoRow icon="globe" label="Країна" value={movie.Country} />
          <InfoRow icon="language" label="Мова" value={movie.Language} />
        </View>

        {movie.Ratings && movie.Ratings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Рейтинги</Text>
            {movie.Ratings.map((rating, index) => (
              <View key={index} style={styles.ratingItem}>
                <Text style={styles.ratingSource}>{rating.Source}:</Text>
                <Text style={styles.ratingValue}>{rating.Value}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <InfoRow icon="trophy" label="Нагороди" value={movie.Awards} />
          <InfoRow icon="cash" label="Бюджет" value={movie.BoxOffice} />
          <InfoRow icon="business" label="Виробництво" value={movie.Production} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
  },
  posterContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  poster: {
    width: 250,
    height: 375,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  metaText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  plot: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
    minWidth: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  ratingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ratingSource: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  ratingValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});
