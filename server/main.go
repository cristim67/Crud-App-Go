package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

import "github.com/gin-contrib/cors"

type Student struct {
	ID        string    `gorm:"column:id;type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	FirstName string    `gorm:"column:firstName;type:varchar(255)" json:"firstName"`
	LastName  string    `gorm:"column:lastName;type:varchar(255)" json:"lastName"`
	BirthDate time.Time `gorm:"column:birthDate" json:"birthDate"`
	Address   string    `gorm:"column:address;type:varchar(255)" json:"address"`
	Email     string    `gorm:"column:email;type:varchar(255)" json:"email"`
	Phone     string    `gorm:"column:phone;type:varchar(20)" json:"phone"`
	CreatedAt time.Time `gorm:"column:createdAt" json:"createdAt"`
}

type Subject struct {
	ID                 string    `gorm:"column:id;type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	SubjectName        string    `gorm:"column:subjectName;type:varchar(255)" json:"subjectName"`
	SubjectDescription string    `gorm:"column:subjectDescription;type:varchar(255)" json:"subjectDescription"`
	ProfessorID        string    `gorm:"column:professorId;type:uuid" json:"professorId"`
	CreatedAt          time.Time `gorm:"column:createdAt" json:"createdAt"`
}

type Professor struct {
	ID        string    `gorm:"column:id;type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	FirstName string    `gorm:"column:firstName;type:varchar(255)" json:"firstName"`
	LastName  string    `gorm:"column:lastName;type:varchar(255)" json:"lastName"`
	Email     string    `gorm:"column:email;type:varchar(255)" json:"email"`
	CreatedAt time.Time `gorm:"column:createdAt" json:"createdAt"`
}

type RegisterStudentSubject struct {
	ID             string    `gorm:"column:id;type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	StudentID      string    `gorm:"column:studentId;type:uuid" json:"studentId"`
	SubjectID      string    `gorm:"column:subjectId;type:uuid" json:"subjectId"`
	Grade          int       `gorm:"column:grade" json:"grade"`
	DateRegistered time.Time `gorm:"column:dateRegistered" json:"dateRegistered"`
	CreatedAt      time.Time `gorm:"column:createdAt" json:"createdAt"`
}

func (RegisterStudentSubject) TableName() string {
	return "registerStudentSubject"
}

func (Student) TableName() string {
	return "students"
}

func (Subject) TableName() string {
	return "subjects"
}

func (Professor) TableName() string {
	return "professors"
}

var db *gorm.DB

func init() {
	var err error
	dbURL := os.Getenv("POSTGRESQL_URL")
	if dbURL == "" {
		log.Fatal("POSTGRESQL_URL environment variable is not set")
	}
	db, err = gorm.Open("postgres", dbURL)
	if err != nil {
		log.Fatal(err)
	}

	if err := db.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";").Error; err != nil {
		log.Fatal(err)
	}
	db.AutoMigrate(&Student{}, &Subject{}, &Professor{}, &RegisterStudentSubject{})
}

func main() {
	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5174"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	router.Use(cors.New(config))

	router.POST("/students", createStudent)
	router.GET("/students", getStudents)
	router.DELETE("/students/:id", deleteStudent)
	router.GET("/students/:id", getStudentByID)
	router.PUT("/students/:id", updateStudent)

	router.POST("/subjects", createSubject)
	router.GET("/subjects", getSubjects)
	router.DELETE("/subjects/:id", deleteSubject)
	router.GET("/subjects/:id", getSubjectByID)
	router.PUT("/subjects/:id", updateSubject)

	router.POST("/professors", createProfessor)
	router.GET("/professors", getProfessors)
	router.DELETE("/professors/:id", deleteProfessor)
	router.GET("/professors/:id", getProfessorByID)
	router.PUT("/professors/:id", updateProfessor)

	router.POST("/registerStudentSubjects", createRegisterStudentSubject)
	router.GET("/registerStudentSubjects", getRegisterStudentSubject)
	router.DELETE("/registerStudentSubjects/:id", deleteRegisterStudentSubject)
	router.GET("/registerStudentSubjects/:id", getRegisterStudentSubjectByID)
	router.PUT("/registerStudentSubjects/:id", updateRegisterStudentSubject)

	port := os.Getenv("PORT")
	if port == "" {
		port = "9123"
	}

	err := router.Run(":" + port)
	if err != nil {
		log.Fatal(err)
	}
}

func createStudent(c *gin.Context) {
	var student Student
	if err := c.ShouldBindJSON(&student); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	student.CreatedAt = time.Now()

	if err := db.Create(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, student)
}

func getStudents(c *gin.Context) {
	var students []Student
	if err := db.Find(&students).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, students)
}

func deleteStudent(c *gin.Context) {
	id := c.Param("id")

	if err := db.Where("id = ?", id).Delete(&Student{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func createSubject(c *gin.Context) {
	var subject Subject
	if err := c.ShouldBindJSON(&subject); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	subject.CreatedAt = time.Now()

	if err := db.Create(&subject).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, subject)
}

func getSubjects(c *gin.Context) {
	var subjects []Subject
	if err := db.Find(&subjects).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, subjects)
}

func deleteSubject(c *gin.Context) {
	id := c.Param("id")

	if err := db.Where("id = ?", id).Delete(&Subject{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func createProfessor(c *gin.Context) {
	var professor Professor
	if err := c.ShouldBindJSON(&professor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	professor.CreatedAt = time.Now()

	if err := db.Create(&professor).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, professor)
}

func getProfessors(c *gin.Context) {
	var professors []Professor
	if err := db.Find(&professors).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, professors)
}

func deleteProfessor(c *gin.Context) {
	id := c.Param("id")

	if err := db.Where("id = ?", id).Delete(&Professor{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func createRegisterStudentSubject(c *gin.Context) {
	var registerStudentSubject RegisterStudentSubject
	if err := c.ShouldBindJSON(&registerStudentSubject); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	registerStudentSubject.CreatedAt = time.Now()

	if err := db.Create(&registerStudentSubject).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, registerStudentSubject)
}

func getRegisterStudentSubject(c *gin.Context) {
	var registerStudentSubjects []RegisterStudentSubject
	if err := db.Find(&registerStudentSubjects).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, registerStudentSubjects)
}

func deleteRegisterStudentSubject(c *gin.Context) {
	id := c.Param("id")

	if err := db.Where("id = ?", id).Delete(&RegisterStudentSubject{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func getStudentByID(c *gin.Context) {
	id := c.Param("id")

	var student Student
	if err := db.Where("id=?", id).First(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, student)
}

func getSubjectByID(c *gin.Context) {
	id := c.Param("id")

	var subject Subject
	if err := db.Where("id = ?", id).First(&subject).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, subject)
}

func getProfessorByID(c *gin.Context) {
	id := c.Param("id")

	var professor Professor
	if err := db.Where("id = ?", id).First(&professor).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, professor)
}

func getRegisterStudentSubjectByID(c *gin.Context) {
	id := c.Param("id")

	var registerStudentSubject RegisterStudentSubject
	if err := db.Where("id = ?", id).First(&registerStudentSubject).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, registerStudentSubject)
}

func updateStudent(c *gin.Context) {
	id := c.Param("id")

	var student Student
	if err := db.Where("id = ?", id).First(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := c.ShouldBindJSON(&student); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func updateSubject(c *gin.Context) {
	id := c.Param("id")

	var subject Subject
	if err := db.Where("id = ?", id).First(&subject).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := c.ShouldBindJSON(&subject); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&subject).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func updateProfessor(c *gin.Context) {
	id := c.Param("id")

	var professor Professor
	if err := db.Where("id = ?", id).First(&professor).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := c.ShouldBindJSON(&professor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&professor).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func updateRegisterStudentSubject(c *gin.Context) {
	id := c.Param("id")

	var registerStudentSubject RegisterStudentSubject
	if err := db.Where("id = ?", id).First(&registerStudentSubject).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := c.ShouldBindJSON(&registerStudentSubject); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Save(&registerStudentSubject).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
