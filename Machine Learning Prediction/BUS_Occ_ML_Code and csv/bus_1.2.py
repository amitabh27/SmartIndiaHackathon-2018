
# coding: utf-8

# In[86]:


import numpy as np
import pandas as pd
df=pd.read_csv("bus_1.2.csv")

df.shape


from sklearn.model_selection import train_test_split
train_set,test_set = train_test_split(df,test_size=0.3,random_state=12)

train_label = train_set["label"].copy()

train_label = train_label.reshape(122,1)

train_data = train_set.drop(['label'], axis=1)


#regression


train_data=np.c_[np.ones((122,1)),train_data]

X=np.array(train_data)

Y=np.array(train_label).flatten()

Y =Y.reshape(122,1)


m=len(train_label)


theta=np.array([0,0,0,0])
theta = theta.reshape(4,1)


iter=20000
eta=0.01

for i in range (iter):
    hypothesis = X.dot(theta)
    
    error = hypothesis - Y
    gradient =  ((X.T).dot(error) *2)/m
    theta = theta - eta*gradient
    





# In[87]:


day = 'monday'
time_slot = 2
stop_id = 13



# In[88]:


if(day == 'monday'):
    day_id = 1
elif(day == 'tuesday'):
    day_id = 2
elif(day == 'wednesday'):
    day_id = 3
elif(day == 'thursday'):
    day_id = 4
elif(day == 'friday'):
    day_id = 5
elif(day == 'saturday'):
    day_id = 6
else:
    day_id = 7


# In[89]:


a = [day_id,time_slot,stop_id,1]


# In[90]:


a = np.array(a)


# In[91]:


a = a.reshape(4,1)


# In[92]:




# In[93]:


ans = a.T.dot(theta)


# In[94]:

print('Predicted Bus Occupancy is -->')
print(int(ans))


