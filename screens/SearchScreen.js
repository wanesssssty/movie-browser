import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Image,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OMDB_API_KEY } from '../config';


export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const searchMovies = async (page = 1, append = false) => {
    if (!query.trim()) {
      setError('Будь ласка, введіть назву фільму');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&page=${page}`
      );
      const data = await res.json();

      if (data.Response === 'True') {
        const newResults = data.Search || [];
        if (append) {
          setResults(prev => [...prev, ...newResults]);
        } else {
          setResults(newResults);
          setTotalResults(parseInt(data.totalResults) || 0);
          setCurrentPage(1);
        }
      } else {
        setError(data.Error || 'Фільми не знайдено');
        if (!append) {
          setResults([]);
        }
      }
    } catch (err) {
      setError('Помилка під час пошуку. Перевірте підключення до інтернету.');
      if (!append) {
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const totalPages = Math.ceil(totalResults / 10);
    if (currentPage < totalPages && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      searchMovies(nextPage, true);
    }
  };

  const handleSearch = () => {
    searchMovies(1, false);
  };

  const renderMovieItem = ({ item }) => {
    if (!item || !item.imdbID) return null;
    
    const posterUri = item.Poster && item.Poster !== 'N/A' 
      ? String(item.Poster) 
      : 'https://via.placeholder.com/100x150?text=No+Image';
    
    return (
      <TouchableOpacity 
        style={styles.movieItem}
        onPress={() => {
          navigation.navigate('Details', { id: String(item.imdbID) });
        }}
      >
        <Image 
          source={{ uri: posterUri }} 
          style={styles.poster}
          resizeMode="cover"
        />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.Title}</Text>
        <Text style={styles.movieYear}>{item.Year}</Text>
        <Text style={styles.movieType}>{item.Type}</Text>
      </View>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loading || results.length === 0) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={24} color="#666" style={styles.searchIcon} />
          <TextInput 
            style={styles.input}
            placeholder="Введіть назву фільму..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity 
            onPress={handleSearch}
            style={styles.searchButton}
            disabled={!!loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="arrow-forward" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color="#ff3b30" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {results.length > 0 && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            Знайдено: {totalResults} {totalResults === 1 ? 'фільм' : 'фільмів'}
          </Text>
        </View>
      )}

      <FlatList 
        data={results}
        keyExtractor={(item, index) => item?.imdbID || String(index)}
        renderItem={renderMovieItem}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !loading && query ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="film-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Фільми не знайдено</Text>
            </View>
          ) : null
        }
        removeClippedSubviews={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe5e5',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#ff3b30',
    marginLeft: 8,
    flex: 1,
  },
  resultsHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  movieItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  movieInfo: {
    flex: 1,
    marginLeft: 12,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  movieType: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
  footerLoader: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
});
