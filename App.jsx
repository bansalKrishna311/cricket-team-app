import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const ROLES = {
  BOWLER: 'Bowler',
  GOOD_PLAYER: 'Good Player',
  AVERAGE_PLAYER: 'Average Player',
  UNKNOWN: 'Unknown Player',
};

const COLORS = {
  primary: '#6366F1',
  secondary: '#3B82F6',
  background: '#F8FAFC',
  white: '#FFFFFF',
  text: '#1E293B',
  textLight: '#64748B',
  border: '#E2E8F0',
  disabled: '#94A3B8',
  cardBackground: '#ffffff',
  selectedCard: '#4ADE80',
};

const INITIAL_PLAYERS = [
  { id: '1', name: 'Niraj', role: ROLES.BOWLER, selected: false },
  { id: '2', name: 'Keshav', role: ROLES.GOOD_PLAYER, selected: false },
  { id: '3', name: 'Lalan', role: ROLES.AVERAGE_PLAYER, selected: false },
  { id: '4', name: 'Harshit', role: ROLES.GOOD_PLAYER, selected: false },
  { id: '5', name: 'Vishnu', role: ROLES.BOWLER, selected: false },
  { id: '6', name: 'Abhishek', role: ROLES.GOOD_PLAYER, selected: false },
  { id: '7', name: 'Nishant', role: ROLES.AVERAGE_PLAYER, selected: false },
  { id: '8', name: 'Gaurav', role: ROLES.GOOD_PLAYER, selected: false },
  { id: '9', name: 'Aman', role: ROLES.GOOD_PLAYER, selected: false },
  { id: '10', name: 'Sujal', role: ROLES.AVERAGE_PLAYER, selected: false },
  { id: '11', name: 'Lokesh', role: ROLES.GOOD_PLAYER, selected: false },
  { id: '12', name: 'Aryan', role: ROLES.GOOD_PLAYER, selected: false },
  { id: '13', name: 'Amandeep', role: ROLES.GOOD_PLAYER, selected: false },
  { id: '14', name: 'Krishna', role: ROLES.AVERAGE_PLAYER, selected: false },
  { id: '15', name: 'Raj', role: ROLES.AVERAGE_PLAYER, selected: false },
  { id: '16', name: 'Vasu', role: ROLES.UNKNOWN, selected: false },
];

const PlayerCard = React.memo(({ player, onSelect }) => (
  <TouchableOpacity
    style={[
      styles.playerCard,
      { backgroundColor: player.selected ? COLORS.selectedCard : COLORS.cardBackground },
    ]}
    onPress={() => onSelect(player.id)}
    activeOpacity={0.7}
  >
    <Text style={[styles.playerName, player.selected && styles.selectedText]}>{player.name}</Text>
    <Text style={[styles.playerRole, player.selected && styles.selectedText]}>{player.role}</Text>
  </TouchableOpacity>
));

const TeamDisplay = ({ team, teamName }) => (
  <View style={styles.teamContainer}>
    <Text style={styles.teamTitle}>{teamName}</Text>
    {team.map((player) => (
      <View key={player.id} style={styles.teamPlayerCard}>
        <Text style={styles.teamPlayerName}>{player.name}</Text>
        <Text style={styles.teamPlayerRole}>{player.role}</Text>
      </View>
    ))}
  </View>
);

const CustomButton = ({ onPress, title, disabled, loading }) => (
  <TouchableOpacity
    style={[styles.button, disabled && styles.buttonDisabled]}
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.8}
  >
    {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>{title}</Text>}
  </TouchableOpacity>
);

export default function App() {
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [teams, setTeams] = useState(null);
  const [commonPlayer, setCommonPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const togglePlayerSelection = useCallback((id) => {
    setPlayers(prev => prev.map(player =>
      player.id === id ? { ...player, selected: !player.selected } : player
    ));
  }, []);

  const shuffleArray = useCallback((array) => {
    return array.sort(() => Math.random() - 0.5);
  }, []);

  const makeTeams = useCallback(() => {
    setIsLoading(true);
    const selectedPlayers = players.filter(p => p.selected);

    if (selectedPlayers.length < 4) {
      alert('Select at least 4 players');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      let extraPlayer = null;

      if (selectedPlayers.length % 2 !== 0) {
        extraPlayer = selectedPlayers.pop();
      }

      const shuffledPlayers = shuffleArray(selectedPlayers);
      const midpoint = Math.floor(shuffledPlayers.length / 2);
      const teamA = shuffledPlayers.slice(0, midpoint);
      const teamB = shuffledPlayers.slice(midpoint);

      setTeams({ teamA, teamB });
      setCommonPlayer(extraPlayer);
      setIsLoading(false);
    }, 500);
  }, [players, shuffleArray]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Cricket Team Maker</Text>
        <View style={styles.playerGrid}>
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} onSelect={togglePlayerSelection} />
          ))}
        </View>

        <CustomButton 
          title="Make Teams" 
          onPress={makeTeams} 
          disabled={players.filter(p => p.selected).length < 4} 
          loading={isLoading} 
        />

        {teams && (
          <>
            <TeamDisplay team={teams.teamA} teamName="Team A" />
            <TeamDisplay team={teams.teamB} teamName="Team B" />
            {commonPlayer && (
              <View style={styles.commonPlayerContainer}>
                <Text style={styles.commonPlayerText}>
                  Common Player: {commonPlayer.name} ({commonPlayer.role})
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: COLORS.text,
  },
  playerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  playerCard: {
    width: CARD_WIDTH,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  playerRole: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  selectedText: {
    color: COLORS.white,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 20,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  teamContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  teamTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.text,
  },
  teamPlayerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  teamPlayerName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  teamPlayerRole: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  commonPlayerContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
  },
  commonPlayerText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});