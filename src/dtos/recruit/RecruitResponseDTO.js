class RecruitResponseDTO {
    constructor(recruit) {
        this.id = recruit.id;
        this.writer = recruit.writer;
        this.projectName = recruit.project_name;
    }
    toJson() {
        return {
            id : this.id,
            writer : this.writer,
            projectName : this.projectName,
        };
    }

    static fromList(recruits) {
        return recruits.map((r) => new RecruitResponseDTO(r));
    } 
}
module.exports = RecruitResponseDTO;