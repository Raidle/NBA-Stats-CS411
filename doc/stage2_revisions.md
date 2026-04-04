# Stage 2 Revised Explanation
## Changes
- Removed `teamid` from PlayerGameStats, as it is an unnecessary attribute that is not relevant to a Player’s performance in a game
- Removed `win` attribute from TeamGameStats, as it is able to be derived from game and comparing home score and away score. This attribute was breaking 3NF form, as it could be derived from other attributes. 
## What was wrong
According to our graded stage 2 submission, the following was observed:
> Insufficient 3NF process. You should follow the 3NF steps covered in lectures, which are: 1. List all FDs from your design, 2. Calculate candidate keys, 3. Find the minimal basis, 4. Construct relations R from your results. Verbal description is not sufficient to prove normalization nor 3NF decomposition. 
To ensure our ER diagram is correct, we have provided the work we used to determine our 3NF correctness below per relation

### Player Relation
The following Player relation is specified as follows:
```
Player(playerId, firstName, lastName, heightInches, bodyWeightlbs)
```
The following functional dependencies are listed below:
- playerId -> firstName, lastName, heightInches, bodyWeightlbs
You cannot derive `firstName`, `lastName`, height, or weight of a player by any of each other's attributes. Thus, the only way to derive these attributes is by the `playerId`, thus `playerId` is a candidate key.

The minimal basis is listed below:
- A(`playerId`,`firstName`)
- B(`playerId`, `lastName`)
- C(`playerId`, `heightInches`)
- D(`playerId`, `bodyWeightlbs`)
Since there is a superkey in the minimal basis, we do not need to add an extra relation. Thus, `Player` is in 3NF form.
### Team Relation
The following Team relation is specified as follows:
```
Team(teamId, name, city)
```
The following functional dependencies are listed below:
- `teamId` -> `name`, `city`
Since `teamId` derives every other attribute in the relation, it is a candidate key. The minimal basis is listed below:
- A(`teamId`, `name`)
- B(`teamId`, `city`)
Since there is a superkey in the minimal basis, we do not need to add an extra relation. Thus, `Team` is in 3NF form.
### Arena Relation
The following Arena relation is specified as follows:
```
Arena(arenaId, name, city, state)
```
The following functional dependencies for Arena are listed below:
```
arenaId -> name, city, state
```
Since `arenaId` derives every other attribute (name doesn't necessary mean city or state, etc), then it must be a candidate key. The minimal basis is listed below:
- A(`arenaId`, `name`)
- B(`arenaId`, `city`)
- C(`arenaId`, `state`)
Since there is a superkey in the minimal basis, we do not need to add an extra relation. Thus, Arena is in 3NF form.
### Game Relation
The following Game relation is specified as follows:
```
Game(gameId, date, arenaId)
```
The following FDs are listed below:
- `gameId` -> `date`, `arenaId`
You cannot derive the date or arena of a game from each other. Thus, the only way to derive these attributes is by the gameId, so gameId is a candidate key. The minimal basis is listed below:
- A(`gameId`, `date`)
- B(`gameId`, `arenaId`)
Since there is a superkey in the minimal basis, we do not need to add an extra relation. Thus, Game is in 3NF form.
### Official Relation
The following Official relation is specified as follows:
```
Official(officialId, fullName)
```
The FD for Official is listed below:
- `officialId` -> `fullName`

You cannot derive the official’s full name from any other attribute in the relation. Thus, the only way to derive this attribute is by the officialId, so officialId is a candidate key.

The minimal basis is listed below:
- A(`officialId`, `fullName`)
Since there is a superkey in the minimal basis, we do not need to add an extra relation. Thus, Official is in 3NF form.
### GameOfficialRelation
The following GameOfficial relation is specified as follows:
```
GameOfficial(gameId, officialId)
```
There is no FDs for this relation since gameId and officialId are the only attributes that are needed to identify a row.

There are no non-trivial functional dependencies in this relation because it is a bridge table connecting games and officials. Neither gameId nor officialId alone determines the other, so the composite pair (gameId, officialId) is the candidate key. Since there are no non-key attributes and no non-trivial dependencies besides the composite key itself, we do not need to add an extra relation. Thus, GameOfficial is in 3NF form.
### PlayerGameStats Relation
The following PlayerGameStats relation is specified as follows:
```
PlayerGameStats(gameId, playerId, points, turnovers, minutes, blocks, steals, ft_percent, assists, rebounds, three_percent, fg_percent)
```
The following functional dependencies are listed below:
```
(gameId, playerId) -> points, turnovers, minutes, blocks, steals, ft_percent, assists, rebounds, three_percent, fg_percent
```
You cannot derive an individual player’s game statistics from only gameId, since many players appear in one game. You also cannot derive them from only playerId, since a player appears in many games. Thus, the only way to derive these attributes is by the combination of gameId and playerId, so (gameId, playerId) is a candidate key. The minimal basis is listed below:
- A(`gameId`, `playerId`, `points`)
- B(`gameId`, `playerId`, `turnovers`)
- C(`gameId`, `playerId`, `minutes`)
- D(`gameId`, `playerId`, `blocks`)
- E(`gameId`, `playerId`, `steals`)
- F(`gameId`, `playerId`, `ft_percent`)
- G(`gameId`, `playerId`, `assists`)
- H(`gameId`, `playerId`, `rebounds`)
- I(`gameId`, `playerId`, `three_percent`)
- J(`gameId`, `playerId`, `fg_percent`)

Since there is a superkey in the minimal basis, we do not need to add an extra relation. Thus, PlayerGameStats is in 3NF form.
### TeamGameStats Relation
The following TeamGameStats relation is specified as follows:
```
TeamGameStats(teamId, gameId, isHome, teamScore, assists, blocks, three_percent, steals, ft_percent, fg_percent, rebounds, turnovers)
```
The following FDs are specified below:
```
(teamId, gameId) -> isHome, teamScore, assists, blocks, three_percent, steals, ft_percent, fg_percent, rebounds, turnovers
```
You cannot derive a team’s statistics from only teamId, since a team appears in many games. You also cannot derive them from only gameId, since multiple teams appear in one game. Thus, the only way to derive these attributes is by the combination of teamId and gameId, so (teamId, gameId) is a candidate key. The minimal basis is listed below:
- A(teamId, gameId, isHome)
- B(teamId, gameId, teamScore)
- C(teamId, gameId, assists)
- D(teamId, gameId, blocks)
- E(teamId, gameId, three_percent)
- F(teamId, gameId, steals)
- G(teamId, gameId, ft_percent)
- H(teamId, gameId, fg_percent)
- I(teamId, gameId, rebounds)
- J(teamId, gameId, turnovers)

Since there is a superkey in the minimal basis, we do not need to add an extra relation. Thus, TeamGameStats is in 3NF form.

## Conclusion
Since all relations are in 3NF form, our entire ER diagram is in 3NF form. We have provided the sufficient work that does not just include verbal descriptions, and instead followed the methodology learned from lecture to guarantee 3NF form.
