class DTOFactory{
    static toStudyDto(id,name, description,earliestBeginOfDataGathering,latestBeginOfDataGathering,minimumStudyDurationPerPerson,maximumStudyDurationPerPerson){
                return {
                    _id:id,
                    name: name,
                    description: description,
                    earliestBeginOfDataGathering:earliestBeginOfDataGathering,
                    latestBeginOfDataGathering:latestBeginOfDataGathering,
                    minimumStudyDurationPerPerson:minimumStudyDurationPerPerson,
                    maximumStudyDurationPerPerson:maximumStudyDurationPerPerson,
                };
            }
    static toStudyDetailDto(id,
        name,
        description,
        userSetsStartDate,
        userSetsTimeRestriction,
        earliestBeginOfDataGathering,
        latestBeginOfDataGathering,
        minimumStudyDurationPerPerson,
        maximumStudyDurationPerPerson,
        defaultFromHour,
        defaultToHour,
        notifValidSec,
        promptingWithInterval,
        promptingIntervalSec,
        repeatingAPrompt,
        repeatDelaySeconds,
        enableInformedConsent,
        tasks,
        triggers,
        informedConsent){
        return{
            _id: id,
            name: name,
    description: description,
    userSetsStartDate: userSetsStartDate,
    userSetsTimeRestriction:userSetsTimeRestriction,
    earliestBeginOfDataGathering:earliestBeginOfDataGathering,
    latestBeginOfDataGathering:latestBeginOfDataGathering,
    minimumStudyDurationPerPerson:minimumStudyDurationPerPerson,
    maximumStudyDurationPerPerson:maximumStudyDurationPerPerson,
    defaultFromHour: defaultFromHour,
    defaultToHour: defaultToHour,
    notifValidSec: notifValidSec,
    promptingWithInterval:promptingWithInterval,
    promptingIntervalSec: promptingIntervalSec,
    repeatingAPrompt:repeatingAPrompt,
    repeatDelaySeconds:repeatDelaySeconds,
    enableInformedConsent: enableInformedConsent,
    tasks: tasks,
    triggers: triggers,
    informedConsent: informedConsent
        }
    }
    static taskResultDto(taskResultsList){
        return {taskResults: taskResultsList};
    }
    static fullStudyData(study,taskResulstList){
        return {dataSchema: study,taskResults:  taskResulstList};
    }
    static toStudyDtoShortSchema(_id,name,description,earliestBeginOfDataGathering,latestBeginOfDataGathering,minimumStudyDurationPerPerson,maximumStudyDurationPerPerson,tasks){
        return {_id:_id,studyName:name,description:description,earliestBeginOfDataGathering,latestBeginOfDataGathering,minimumStudyDurationPerPerson,maximumStudyDurationPerPerson,tasks:tasks};
    }
}
module.exports = DTOFactory;