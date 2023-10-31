/*
 * @Author: Hey Kimo here!
 * @Date: 2022-02-04 16:20:31
 * @Last Modified by: ---- KIMO a.k.a KIMOSABE ----
 * @Last Modified time: 2022-06-20 12:53:50
 */
var config = require("../dbconfig");
const sql = require("mssql");

async function getAllCareer() {
  try {
    var pool = await sql.connect(config);
    var result = await pool.request().query("SELECT * FROM [CAREER]");
    return result.recordsets[0];
  } catch (error) {
    console.log("getAllCareer-->", error);
    //
  }
}

async function addCareer(obj) {
  try {
    var pool = await sql.connect(config);
    if (pool._connected == false) {
      pool = await sql.connect(config);
    }
    var result = await pool
      .request()
      .input("CAREER_EMAIL", sql.VarChar, obj.Email)
      .query("SELECT * from CAREER WHERE CAREER_EMAIL=@CAREER_EMAIL");
    if (result.rowsAffected[0] == 0) {
      var insertInto = await pool
        .request()
        .input("CAREER_FIRST_NAME", obj.FirstName)
        .input("CAREER_LAST_NAME", obj.LastName)
        .input("CAREER_EMAIL", obj.Email)
        .input("CAREER_PHONE_NUMBER", obj.PhoneNumber)
        .input("CAREER_DOB", obj.DoB)
        .input("CAREER_YEARS_OF_EXPERIENCE", obj.YearsOfExp)
        .input("CAREER_STREET_ADDRESS", obj.StreetAddress)
        .input("CAREER_APARTMENT", obj.Appartment)
        .input("CAREER_CITY", obj.city)
        .input("CAREER_STATE", obj.state)
        .input("CAREER_COUNTRY", obj.country)
        .input("CAREER_ZIP_CODE", obj.zipcode)
        .input("CAREER_ACADEMIC_BACKGROUND", obj.AcademicBackground)
        .input("CAREER_ARTISTIC_SKILLS", obj.ArtisticSkill)
        .input("CAREER_CHARACTER", obj.Character)
        .input("CAREER_AMBITION", obj.Ambition)
        .input("CAREER_EMOTIONAL_STABILITY", obj.EmotionalStability)
        .input("CAREER_ABILITY_TO_WORK_OTHERS", obj.AbilityToworkwithOthers)
        .input("CAREER_COMMUNICATION_SKILLS", obj.CommunicationSkills)
        .input("CAREER_COVER_LETTER", obj.CoverLetter)
        .input("CAREER_CONFIRMATION_BOX", obj.CheckConfirmed)
        .query(
          "insert into CAREER (CAREER_FIRST_NAME,CAREER_LAST_NAME,CAREER_EMAIL,CAREER_PHONE_NUMBER,CAREER_DOB,CAREER_YEARS_OF_EXPERIENCE,CAREER_STREET_ADDRESS,CAREER_APARTMENT,CAREER_CITY,CAREER_STATE,CAREER_COUNTRY,CAREER_ZIP_CODE,CAREER_ACADEMIC_BACKGROUND,CAREER_ARTISTIC_SKILLS,CAREER_CHARACTER,CAREER_AMBITION,CAREER_EMOTIONAL_STABILITY,CAREER_ABILITY_TO_WORK_OTHERS,CAREER_COMMUNICATION_SKILLS,CAREER_COVER_LETTER,CAREER_CONFIRMATION_BOX) values(@CAREER_FIRST_NAME,@CAREER_LAST_NAME,@CAREER_EMAIL,@CAREER_PHONE_NUMBER,@CAREER_DOB,@CAREER_YEARS_OF_EXPERIENCE,@CAREER_STREET_ADDRESS,@CAREER_APARTMENT,@CAREER_CITY,@CAREER_STATE,@CAREER_COUNTRY,@CAREER_ZIP_CODE,@CAREER_ACADEMIC_BACKGROUND,@CAREER_ARTISTIC_SKILLS,@CAREER_CHARACTER,@CAREER_AMBITION,@CAREER_EMOTIONAL_STABILITY,@CAREER_ABILITY_TO_WORK_OTHERS,@CAREER_COMMUNICATION_SKILLS,@CAREER_COVER_LETTER,@CAREER_CONFIRMATION_BOX)"
        );
      if (pool._connected == false) {
        pool = await sql.connect(config);
      }
      if (insertInto.rowsAffected == 1) {
        return "1";
      } else {
        return "2";
      }
    } else {
      return "0";
    }
  } catch (err) {
    console.log("addCareer-->", err);
  }
}

module.exports = {
    getAllCareer: getAllCareer,
    addCareer: addCareer,
  };