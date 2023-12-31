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
	ID        string    `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	FirstName string    `gorm:"type:varchar(100)" json:"firstName"`
	LastName  string    `gorm:"type:varchar(100)" json:"lastName"`
	BirthDate time.Time `json:"birthDate"`
	Address   string    `gorm:"type:varchar(255)" json:"address"`
	Email     string    `gorm:"type:varchar(255)" json:"email"`
	Phone     string    `gorm:"type:varchar(20)" json:"phone"`
	CreatedAt time.Time `json:"createdAt"`
}

type Subject struct {
	ID                 string    `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	SubjectName        string    `gorm:"type:varchar(100)" json:"subjectName"`
	SubjectDescription string    `gorm:"type:varchar(255)" json:"subjectDescription"`
	ProfessorID        string    `gorm:"type:uuid" json:"professorId"`
	CreatedAt          time.Time `json:"createdAt"`
}

type Professor struct {
	ID        string    `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	FirstName string    `gorm:"type:varchar(100)" json:"firstName"`
	LastName  string    `gorm:"type:varchar(100)" json:"lastName"`
	Email     string    `gorm:"type:varchar(255)" json:"email"`
	CreatedAt time.Time `json:"createdAt"`
}

type RegisterStudentSubject struct {
	ID             string    `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
	StudentID      string    `gorm:"type:uuid" json:"studentId"`
	SubjectID      string    `gorm:"type:uuid" json:"subjectId"`
	Grade          int       `json:"grade"`
	DateRegistered time.Time `json:"dateRegistered"`
	CreatedAt      time.Time `json:"createdAt"`
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
	config.AllowOrigins = []string{"http://localhost:5173"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	router.Use(cors.New(config))

	router.POST("/students", createStudent)
	router.GET("/students", getStudents)
	router.DELETE("/students/:id", deleteStudent)
	router.GET("/students/:id", getStudentByID)

	router.POST("/subjects", createSubject)
	router.GET("/subjects", getSubjects)
	router.DELETE("/subjects/:id", deleteSubject)
	router.GET("/subjects/:id", getSubjectByID)

	router.POST("/professors", createProfessor)
	router.GET("/professors", getProfessors)
	router.DELETE("/professors/:id", deleteProfessor)
	router.GET("/professors/:id", getProfessorByID)

	router.POST("/registerStudentSubject", createRegisterStudentSubject)
	router.GET("/registerStudentSubject", getRegisterStudentSubject)
	router.DELETE("/registerStudentSubject/:id", deleteRegisterStudentSubject)
	router.GET("/registerStudentSubject/:id", getRegisterStudentSubjectByID)

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
	if err := db.Where("id = ?", id).First(&student).Error; err != nil {
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
