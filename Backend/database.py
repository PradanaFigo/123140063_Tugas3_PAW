from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session, declarative_base
from zope.sqlalchemy import register

# Password disesuaikan dengan input kamu: figo1234
DATABASE_URL = "postgresql://postgres:figo1234@localhost:5432/review_db"

engine = create_engine(DATABASE_URL)
DBSession = scoped_session(sessionmaker(bind=engine))
register(DBSession)
Base = declarative_base()